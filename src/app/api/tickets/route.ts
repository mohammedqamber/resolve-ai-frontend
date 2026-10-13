import { proxyAuthed } from "@/lib/server/resolveApi";

export async function GET() {
  return proxyAuthed("/api/tickets");
}
