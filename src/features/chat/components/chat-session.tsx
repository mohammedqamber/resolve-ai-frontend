"use client";

import { PanelRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SessionInfo } from "@/features/session/types";
import { truncate } from "@/lib/format";

import { useChat } from "../hooks/useChat";
import type { ConversationResponse } from "../types";
import { ChatEmptyState } from "./chat-empty-state";
import { ChatHeader } from "./chat-header";
import { Composer } from "./composer";
import { ConfirmationCard } from "./confirmation-card";
import { InspectorPanel } from "./inspector-panel";
import { MessageList } from "./message-list";
import { SendError } from "./send-error";

export type ChatSessionProps = {
  session: SessionInfo;
  initial: ConversationResponse | null;
  initialPrompt?: string;
  onTurnComplete: (conversationId: string, message: string) => void;
  onStartNew: () => void;
  onOpenSidebar: () => void;
};

export function ChatSession({
  session,
  initial,
  initialPrompt,
  onTurnComplete,
  onStartNew,
  onOpenSidebar,
}: ChatSessionProps) {
  const chat = useChat({ profile: session.profile, initial, onTurnComplete });

  const firstQuestion = chat.messages.find((m) => m.role === "user")?.text;
  const title = firstQuestion ? truncate(firstQuestion, 80) : "New investigation";

  const inspector = (
    <InspectorPanel
      profile={session.profile}
      messages={chat.messages}
      historyActivities={chat.historyActivities}
      isSending={chat.isSending}
    />
  );

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          title={title}
          conversationId={chat.conversationId}
          onOpenSidebar={onOpenSidebar}
          actions={
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="xl:hidden">
                  <PanelRightIcon /> Activity
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
                <SheetHeader className="border-b">
                  <SheetTitle>Investigation details</SheetTitle>
                  <SheetDescription>Real tool calls and this customer&apos;s tickets.</SheetDescription>
                </SheetHeader>
                {inspector}
              </SheetContent>
            </Sheet>
          }
        />

        {chat.messages.length === 0 ? (
          <ChatEmptyState session={session} disabled={chat.isSending} onPick={chat.send} />
        ) : (
          <MessageList
            messages={chat.messages}
            profile={session.profile}
            sendingSince={chat.sendingSince}
          />
        )}

        <div className="mx-auto w-full max-w-3xl space-y-3 px-3 pb-3 sm:px-6 sm:pb-4">
          {chat.pendingAction && (
            <ConfirmationCard
              action={chat.pendingAction}
              disabled={chat.isSending}
              sendingMessage={chat.sendingMessage}
              onRespond={chat.send}
            />
          )}
          {chat.sendError && (
            <SendError sendError={chat.sendError} onRetry={chat.retry} onStartNew={onStartNew} />
          )}
          <Composer
            onSend={chat.send}
            isSending={chat.isSending}
            rateLimitedUntil={chat.rateLimitedUntil}
            initialValue={initialPrompt}
          />
          <p className="text-center text-[11px] text-muted-foreground">
            AI agent · Answers come from fictional demo records and may contain mistakes.
          </p>
        </div>
      </div>

      <aside
        aria-label="Investigation details"
        className="hidden w-[360px] shrink-0 flex-col border-l bg-canvas/50 xl:flex"
      >
        {inspector}
      </aside>
    </div>
  );
}
