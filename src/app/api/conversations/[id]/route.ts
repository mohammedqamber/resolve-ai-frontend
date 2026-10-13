import { proxyAuthed } from "@/lib/server/resolveApi";

export async function GET(_request: Request, ctx: RouteContext<"/api/conversations/[id]">) {
  const { id } = await ctx.params;
  return proxyAuthed(`/api/conversations/${encodeURIComponent(id)}`);
}
