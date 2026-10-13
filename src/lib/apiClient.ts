// Browser-side HTTP client. It only talks to our own Next.js proxy routes
// (src/app/api/*), which attach the session token server-side.

export type ApiErrorBody = { error: { code: string; message: string } };

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    /** Seconds, from the Retry-After header (429 responses). */
    public retryAfter?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Slightly above the proxy's own 120s upstream timeout.
const CLIENT_TIMEOUT_MS = 130_000;

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  { method = "GET", body }: RequestOptions = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the server.");
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const error = (data as ApiErrorBody | null)?.error;
    throw new ApiError(
      res.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.message ?? "Something went wrong.",
      Number(res.headers.get("retry-after")) || undefined,
    );
  }

  return data as T;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
