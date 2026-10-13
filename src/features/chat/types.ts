// Types from the ResolveAI API contract (section 5).

export type ActivityStatus =
  | "started"
  | "success"
  | "awaiting_confirmation"
  | "error";

export type Activity = {
  tool: string;
  status: ActivityStatus;
  startedAt: string;
  completedAt?: string;
  inputSummary: string;
  outputSummary?: string;
};

export type PendingAction = {
  // Treated as a string: more action types may appear later.
  type: "CREATE_SUPPORT_TICKET" | (string & {});
  actionId: string;
  requiresConfirmation: true;
  summary: string;
};

export type ChatRequest = { message: string; conversationId?: string };

export type ChatResponse = {
  conversationId: string;
  reply: string;
  /** Activities from this request only. */
  activities: Activity[];
  pendingAction?: PendingAction;
};

export type ConversationResponse = {
  conversationId: string;
  messages: { role: "user" | "assistant"; text: string }[];
  /** Every activity of the conversation, oldest first, not linked to messages. */
  activities: Activity[];
  pendingAction?: PendingAction;
};

// UI-only types.

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Live turns only: the activities returned with this reply. */
  activities?: Activity[];
  /** User message whose request failed (nothing was saved server-side). */
  failed?: boolean;
};

export type RecentConversation = {
  id: string;
  title: string;
  updatedAt: number;
};
