import "server-only";

import { cookies } from "next/headers";

import type {
  ProfileId,
  SessionInfo,
  SessionResponse,
} from "@/features/session/types";

// Server-side bridge to the ResolveAI backend. The browser never sees the
// backend URL or the session token: the token lives in an httpOnly cookie and
// is attached here.

const API_URL = (
  process.env.RESOLVE_API_URL ?? "https://resolve-ai-ghzv.onrender.com"
).replace(/\/$/, "");

// The contract recommends a 120s client timeout for chat requests.
const UPSTREAM_TIMEOUT_MS = 120_000;

const TOKEN_COOKIE = "rai_token";
const PROFILE_COOKIE = "rai_profile";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

const TOKEN_MAX_AGE = 60 * 60 * 8; // Same 8 hours as the server session.
const PROFILE_MAX_AGE = 60 * 60 * 24 * 30; // Lets us renew an expired token.

type UpstreamInit = { method?: "GET" | "POST"; body?: string; token?: string };

function jsonError(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

async function callUpstream(
  path: string,
  { method = "GET", body, token }: UpstreamInit = {},
): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      body,
      headers: {
        ...(body ? { "content-type": "application/json" } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return jsonError(504, "UPSTREAM_TIMEOUT", "The server took too long to respond.");
    }
    return jsonError(502, "UPSTREAM_UNREACHABLE", "Could not reach the ResolveAI server.");
  }
}

/** Passes an upstream response to the browser, keeping status and Retry-After. */
async function relay(upstream: Response): Promise<Response> {
  const isJson = upstream.headers
    .get("content-type")
    ?.includes("application/json");

  // A sleeping free-tier host can answer with an HTML error page.
  if (!isJson) {
    return jsonError(502, "UPSTREAM_UNREACHABLE", "The ResolveAI server is starting up.");
  }

  const headers = new Headers({
    "content-type": "application/json",
    "cache-control": "no-store",
  });
  const retryAfter = upstream.headers.get("retry-after");
  if (retryAfter) headers.set("retry-after", retryAfter);

  return new Response(await upstream.text(), { status: upstream.status, headers });
}

async function storeSession({ sessionToken, profile, name }: SessionResponse) {
  const store = await cookies();
  store.set(TOKEN_COOKIE, sessionToken, { ...cookieOptions, maxAge: TOKEN_MAX_AGE });
  store.set(PROFILE_COOKIE, JSON.stringify({ profile, name }), {
    ...cookieOptions,
    maxAge: PROFILE_MAX_AGE,
  });
}

async function requestSession(profile: string) {
  return callUpstream("/api/session", {
    method: "POST",
    body: JSON.stringify({ profile }),
  });
}

/** Creates a fresh token for the same profile (contract: on 401, renew and retry once). */
async function renewToken(profile: ProfileId): Promise<string | null> {
  const upstream = await requestSession(profile);
  if (!upstream.ok) return null;
  const data = (await upstream.json()) as SessionResponse;
  await storeSession(data);
  return data.sessionToken;
}

/** Reads the current demo customer from the httpOnly cookie. */
export async function getSessionInfo(): Promise<SessionInfo | null> {
  const raw = (await cookies()).get(PROFILE_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SessionInfo>;
    return parsed.profile && parsed.name
      ? { profile: parsed.profile, name: parsed.name }
      : null;
  } catch {
    return null;
  }
}

/** POST /api/session: stores the token in a cookie and never returns it. */
export async function startSession(profile: string): Promise<Response> {
  const upstream = await requestSession(profile);
  if (!upstream.ok) return relay(upstream);

  const data = (await upstream.json()) as SessionResponse;
  await storeSession(data);
  const info: SessionInfo = { profile: data.profile, name: data.name };
  return Response.json(info, { status: 201 });
}

/** Unauthenticated routes: /health, /api/profiles. */
export async function proxyPublic(path: string): Promise<Response> {
  return relay(await callUpstream(path));
}

/** Authenticated routes: attaches the cookie's token, renews it once on 401. */
export async function proxyAuthed(
  path: string,
  init: Omit<UpstreamInit, "token"> = {},
): Promise<Response> {
  const session = await getSessionInfo();
  if (!session) {
    return jsonError(401, "UNAUTHENTICATED", "Choose a demo customer to start.");
  }

  const token =
    (await cookies()).get(TOKEN_COOKIE)?.value ??
    (await renewToken(session.profile));
  if (!token) {
    return jsonError(401, "UNAUTHENTICATED", "Your demo session has ended.");
  }

  let upstream = await callUpstream(path, { ...init, token });

  // Tokens live in server memory and are lost on a backend restart.
  if (upstream.status === 401) {
    const freshToken = await renewToken(session.profile);
    if (freshToken) {
      upstream = await callUpstream(path, { ...init, token: freshToken });
    }
  }

  return relay(upstream);
}
