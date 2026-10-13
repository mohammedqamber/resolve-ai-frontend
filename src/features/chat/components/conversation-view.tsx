"use client";

import { MessageSquareOffIcon, RotateCwIcon, SquarePenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isApiError } from "@/lib/apiClient";
import { getErrorMessage } from "@/lib/errors";

import { useConversation } from "../hooks/useConversation";
import { ChatHeader } from "./chat-header";
import { ChatSession, type ChatSessionProps } from "./chat-session";

type ConversationViewProps = Omit<ChatSessionProps, "initial"> & {
  /** A saved conversation to restore, or null to start a new one. */
  restoreId: string | null;
  onForget: (id: string) => void;
};

export function ConversationView({ restoreId, onForget, ...props }: ConversationViewProps) {
  if (!restoreId) return <ChatSession initial={null} {...props} />;
  return <RestoredConversation id={restoreId} onForget={onForget} {...props} />;
}

function RestoredConversation({
  id,
  onForget,
  ...props
}: Omit<ConversationViewProps, "restoreId"> & { id: string }) {
  const conversation = useConversation(props.session.profile, id);

  if (conversation.isPending) {
    return (
      <div className="flex min-w-0 flex-1 flex-col" aria-busy="true">
        <ChatHeader title="Restoring conversation…" conversationId={id} onOpenSidebar={props.onOpenSidebar} />
        <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 sm:px-6">
          <Skeleton className="ml-auto h-11 w-2/3 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="ml-auto h-11 w-1/3 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (conversation.isError) {
    const notFound =
      isApiError(conversation.error) && conversation.error.code === "CONVERSATION_NOT_FOUND";

    return (
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader title="Conversation unavailable" conversationId={id} onOpenSidebar={props.onOpenSidebar} />
        <div role="alert" className="m-auto flex max-w-sm flex-col items-center gap-3 px-6 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <MessageSquareOffIcon className="size-5 text-muted-foreground" aria-hidden />
          </span>
          <p className="font-medium">
            {notFound ? "This conversation isn't available" : "Couldn't restore this conversation"}
          </p>
          <p className="text-sm text-muted-foreground">
            {notFound
              ? "It may have been removed, or it belongs to a different demo customer."
              : getErrorMessage(conversation.error)}
          </p>
          <div className="flex gap-2 pt-1">
            {!notFound && (
              <Button variant="outline" onClick={() => conversation.refetch()}>
                <RotateCwIcon /> Try again
              </Button>
            )}
            <Button
              onClick={() => {
                if (notFound) onForget(id);
                props.onStartNew();
              }}
            >
              <SquarePenIcon /> New investigation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <ChatSession initial={conversation.data} {...props} />;
}
