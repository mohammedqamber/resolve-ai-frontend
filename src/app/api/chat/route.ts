import { proxyAuthed } from "@/lib/server/resolveApi";

// An agent turn can take up to ~30s, plus a possible cold start.
export const maxDuration = 120;

export async function POST(request: Request) {
  return proxyAuthed("/api/chat", { method: "POST", body: await request.text() });
}
