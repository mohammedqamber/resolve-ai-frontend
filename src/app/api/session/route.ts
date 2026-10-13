import { startSession } from "@/lib/server/resolveApi";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { profile?: unknown } | null;
  const profile = typeof body?.profile === "string" ? body.profile : "";
  // The backend validates the profile and returns the contract's errors.
  return startSession(profile);
}
