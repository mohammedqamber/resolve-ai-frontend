import { apiRequest } from "@/lib/apiClient";

import type { ChatRequest, ChatResponse, ConversationResponse } from "../types";

export function sendChatMessage(body: ChatRequest) {
  return apiRequest<ChatResponse>("/api/chat", { method: "POST", body });
}

export function fetchConversation(id: string) {
  return apiRequest<ConversationResponse>(`/api/conversations/${encodeURIComponent(id)}`);
}
