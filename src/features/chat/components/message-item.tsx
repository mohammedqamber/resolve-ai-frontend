import { CircleAlertIcon } from "lucide-react";

import { LogoMark } from "@/components/layout/logo";
import { TicketReferences } from "@/features/tickets/components/ticket-references";

import type { ChatMessage } from "../types";
import { ActivityTrace } from "./activity-trace";

export function AssistantAvatar() {
  return <LogoMark className="size-6" />;
}

export function MessageItem({ message, profile }: { message: ChatMessage; profile: string }) {
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1">
        <p className="sr-only">You said:</p>
        <div
          className={
            message.failed
              ? "max-w-[85%] rounded-2xl rounded-br-md border border-destructive/30 bg-danger-soft px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words"
              : "max-w-[85%] rounded-2xl rounded-br-md bg-muted px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words"
          }
        >
          {message.text}
        </div>
        {message.failed && (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <CircleAlertIcon className="size-3.5" aria-hidden /> Not sent
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <AssistantAvatar />
      <div className="min-w-0 flex-1 space-y-3">
        <p className="sr-only">ResolveAI replied:</p>
        {/* Plain text only (contract 3): React escapes it; pre-wrap keeps line breaks. */}
        <div className="pt-0.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </div>
        <TicketReferences profile={profile} text={message.text} />
        {message.activities && message.activities.length > 0 && (
          <ActivityTrace activities={message.activities} />
        )}
      </div>
    </div>
  );
}
