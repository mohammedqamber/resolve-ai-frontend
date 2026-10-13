"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { SessionInfo } from "@/features/session/types";

import { useRecentConversations } from "../hooks/useRecentConversations";
import { ConversationSidebar } from "./conversation-sidebar";
import { ConversationView } from "./conversation-view";

/** Keeps the URL in sync so a refresh restores the conversation (contract 9.3). */
function syncUrl(conversationId: string | null) {
  window.history.replaceState(null, "", conversationId ? `/chat?c=${conversationId}` : "/chat");
}

export function ChatWorkspace({ session }: { session: SessionInfo }) {
  const searchParams = useSearchParams();
  const { recents, touch, remove } = useRecentConversations(session.profile);

  // `key` remounts the conversation view; `restoreId` is what it loads from the server.
  const [view, setView] = useState(() => {
    const id = searchParams.get("c");
    return { key: id ?? "initial", restoreId: id };
  });
  const [activeId, setActiveId] = useState(view.restoreId);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialPrompt] = useState(() => searchParams.get("prompt") ?? "");

  const openConversation = (id: string | null) => {
    setView({ key: id ?? crypto.randomUUID(), restoreId: id });
    setActiveId(id);
    syncUrl(id);
    setSidebarOpen(false);
  };

  const handleTurnComplete = (conversationId: string, message: string) => {
    touch(conversationId, message);
    if (conversationId !== activeId) {
      setActiveId(conversationId);
      syncUrl(conversationId);
    }
  };

  const sidebar = (
    <ConversationSidebar
      session={session}
      recents={recents}
      activeId={activeId}
      onSelect={(id) => (id === activeId ? setSidebarOpen(false) : openConversation(id))}
      onNew={() => openConversation(null)}
    />
  );

  return (
    <div className="flex h-dvh bg-canvas">
      <aside aria-label="Conversations" className="hidden w-64 shrink-0 md:block">
        {sidebar}
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 bg-canvas p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Conversations</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      <main className="flex min-w-0 flex-1 md:py-2 md:pr-2">
        <div className="flex min-w-0 flex-1 overflow-hidden bg-background md:rounded-xl md:border md:shadow-xs">
          <ConversationView
            key={view.key}
            restoreId={view.restoreId}
            session={session}
            initialPrompt={view.key === "initial" ? initialPrompt : undefined}
            onTurnComplete={handleTurnComplete}
            onStartNew={() => openConversation(null)}
            onForget={remove}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        </div>
      </main>
    </div>
  );
}
