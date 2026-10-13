import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ChatWorkspace } from "@/features/chat/components/chat-workspace";
import { WorkspaceSkeleton } from "@/features/chat/components/workspace-skeleton";
import { getSessionInfo } from "@/lib/server/resolveApi";

export const metadata: Metadata = { title: "Workspace" };

export default function ChatPage() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <Workspace />
    </Suspense>
  );
}

async function Workspace() {
  const session = await getSessionInfo();
  if (!session) redirect("/");

  // Keyed by profile so switching customers always starts from a clean state.
  return <ChatWorkspace key={session.profile} session={session} />;
}
