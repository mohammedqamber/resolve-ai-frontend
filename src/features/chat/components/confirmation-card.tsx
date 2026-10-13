"use client";

import { CheckIcon, Loader2Icon, TicketIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CANCEL_MESSAGE, CONFIRM_MESSAGE } from "../constants";
import type { PendingAction } from "../types";

type ConfirmationCardProps = {
  action: PendingAction;
  /** The message currently being sent, if any. */
  sendingMessage?: string;
  disabled: boolean;
  onRespond: (message: string) => void;
};

/**
 * Contract 6.2: the agent only proposes a ticket. Confirm/Cancel send the
 * contract's recommended plain chat messages; nothing else is special.
 */
export function ConfirmationCard({
  action,
  sendingMessage,
  disabled,
  onRespond,
}: ConfirmationCardProps) {
  const isTicket = action.type === "CREATE_SUPPORT_TICKET";

  return (
    <section
      aria-label="Action awaiting your confirmation"
      className="animate-in rounded-xl border border-warning/30 bg-warning-soft p-3.5 shadow-xs duration-300 fade-in-0 slide-in-from-bottom-2 sm:p-4"
    >
      <div className="flex gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-warning/25 bg-background text-warning">
          <TicketIcon className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium">
            {isTicket ? "Create this support ticket?" : "Confirm this action?"}
          </p>
          <p className="text-sm leading-relaxed text-pretty text-foreground/80">{action.summary}</p>
          <p className="text-xs text-muted-foreground">
            Nothing is created until you confirm. Proposals expire after 30 minutes.
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="outline" disabled={disabled} onClick={() => onRespond(CANCEL_MESSAGE)}>
          {sendingMessage === CANCEL_MESSAGE ? <Loader2Icon className="animate-spin" /> : <XIcon />}
          Cancel
        </Button>
        <Button disabled={disabled} onClick={() => onRespond(CONFIRM_MESSAGE)}>
          {sendingMessage === CONFIRM_MESSAGE ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <CheckIcon />
          )}
          {isTicket ? "Confirm ticket" : "Confirm"}
        </Button>
      </div>
    </section>
  );
}
