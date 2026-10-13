import { proxyPublic } from "@/lib/server/resolveApi";

export async function GET() {
  return proxyPublic("/health");
}
