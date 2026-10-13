import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ticketsQueryKey } from "@/features/tickets/hooks/useTickets";
import { isApiError } from "@/lib/apiClient";
import { isUnknownOutcome } from "@/lib/errors";

import { fetchConversation, sendChatMessage } from "../api/chatApi";
import { MAX_MESSAGE_LENGTH } from "../constants";
import type {
  Activity,
  ChatMessage,
  ChatResponse,
  ConversationResponse,
  PendingAction,
} from "../types";

type UseChatOptions = {
  profile: string;
  /** A saved conversation to resume, or null for a new one. */
  initial: ConversationResponse | null;
  /** Called after every successful turn (used to remember recent conversations). */
  onTurnComplete: (conversationId: string, message: string) => void;
};

export type SendError = { error: unknown; message: string };

function historyToMessages(conversation: ConversationResponse): ChatMessage[] {
  return conversation.messages.map((message, index) => ({
    id: `history-${index}`,
    role: message.role,
    text: message.text,
  }));
}

/**
 * Conversation state for one chat (contract 9.2). The backend is the source
 * of truth: replies, activities and pending actions are only ever taken from
 * its responses.
 */
export function useChat({ profile, initial, onTurnComplete }: UseChatOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [conversationId, setConversationId] = useState(initial?.conversationId ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initial ? historyToMessages(initial) : [],
  );
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    initial?.pendingAction ?? null,
  );
  const [sendError, setSendError] = useState<SendError | null>(null);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);

  // Activities of the restored history. They are not linked to messages.
  const historyActivities: Activity[] = initial?.activities ?? [];

  const mutation = useMutation({ mutationFn: sendChatMessage });

  const refreshTickets = () =>
    queryClient.invalidateQueries({ queryKey: ticketsQueryKey(profile) });

  function appendAssistant(text: string, activities?: Activity[]) {
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "assistant", text, activities },
    ]);
  }

  function applyResponse(response: ChatResponse, message: string, hadPendingAction: boolean) {
    setConversationId(response.conversationId);
    appendAssistant(response.reply, response.activities);
    setPendingAction(response.pendingAction ?? null);
    onTurnComplete(response.conversationId, message);

    // Contract 6.2: the ticket ID is only in the reply text, so refetch the
    // ticket list after any response that followed a pending action.
    if (hadPendingAction) refreshTickets();
  }

  /** Contract 7: after a network timeout, check whether the server already answered. */
  async function recoverFromUnknownOutcome(message: string): Promise<boolean> {
    if (!conversationId) return false;
    const saved = await fetchConversation(conversationId).catch(() => null);
    const [lastUser, lastReply] = saved?.messages.slice(-2) ?? [];
    if (lastUser?.role !== "user" || lastUser.text !== message || lastReply?.role !== "assistant") {
      return false;
    }
    appendAssistant(lastReply.text);
    setPendingAction(saved?.pendingAction ?? null);
    refreshTickets();
    return true;
  }

  async function handleError(error: unknown, message: string, userMessageId: string) {
    if (isApiError(error) && error.code === "UNAUTHENTICATED") {
      // The proxy already tried to renew the session; start over.
      router.push("/");
      return;
    }
    if (isApiError(error) && error.code === "RATE_LIMITED" && error.retryAfter) {
      setRateLimitedUntil(Date.now() + error.retryAfter * 1000);
    }
    if (isUnknownOutcome(error) && (await recoverFromUnknownOutcome(message))) return;

    setMessages((previous) =>
      previous.map((m) => (m.id === userMessageId ? { ...m, failed: true } : m)),
    );
    setSendError({ error, message });
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || message.length > MAX_MESSAGE_LENGTH || mutation.isPending) return;

    const hadPendingAction = pendingAction !== null;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", text: message };

    // A failed message was never saved server-side, so drop it on the next send.
    setMessages((previous) => [...previous.filter((m) => !m.failed), userMessage]);
    setSendError(null);
    setRateLimitedUntil(null);

    try {
      const response = await mutation.mutateAsync({
        message,
        conversationId: conversationId ?? undefined,
      });
      applyResponse(response, message, hadPendingAction);
    } catch (error) {
      await handleError(error, message, userMessage.id);
    }
  }

  return {
    conversationId,
    messages,
    historyActivities,
    pendingAction,
    sendError,
    rateLimitedUntil,
    isSending: mutation.isPending,
    /** The message currently in flight, e.g. to show which button was clicked. */
    sendingMessage: mutation.isPending ? mutation.variables?.message : undefined,
    sendingSince: mutation.isPending ? mutation.submittedAt : undefined,
    send,
    retry: () => sendError && send(sendError.message),
  };
}

export type ChatState = ReturnType<typeof useChat>;
