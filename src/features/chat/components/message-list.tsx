import type { ChatMessage } from "../types";
import { AgentWorking } from "./agent-working";
import { MessageItem } from "./message-item";

type MessageListProps = {
  messages: ChatMessage[];
  profile: string;
  sendingSince?: number;
};

export function MessageList({ messages, profile, sendingSince }: MessageListProps) {
  return (
    // column-reverse keeps the scroll pinned to the newest message without effects.
    <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto">
      <div
        role="log"
        aria-label="Conversation"
        aria-busy={sendingSince !== undefined}
        className="mx-auto w-full max-w-3xl space-y-7 px-4 py-8 sm:px-6"
      >
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} profile={profile} />
        ))}
        {sendingSince !== undefined && <AgentWorking since={sendingSince} />}
      </div>
    </div>
  );
}
