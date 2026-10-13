import { CircleAlertIcon, RotateCwIcon, SquarePenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isApiError } from "@/lib/apiClient";
import { getErrorMessage } from "@/lib/errors";

import type { SendError as SendErrorState } from "../hooks/useChat";

type SendErrorProps = {
  sendError: SendErrorState;
  onRetry: () => void;
  onStartNew: () => void;
};

export function SendError({ sendError, onRetry, onStartNew }: SendErrorProps) {
  const code = isApiError(sendError.error) ? sendError.error.code : undefined;

  return (
    <div
      role="alert"
      className="flex animate-in items-center gap-3 rounded-xl border border-destructive/20 bg-danger-soft px-3.5 py-2.5 text-sm duration-200 fade-in-0"
    >
      <CircleAlertIcon className="size-4 shrink-0 text-destructive" aria-hidden />
      <p className="min-w-0 flex-1 text-pretty">{getErrorMessage(sendError.error)}</p>
      {code === "CONVERSATION_NOT_FOUND" ? (
        <Button size="sm" variant="outline" onClick={onStartNew}>
          <SquarePenIcon /> New conversation
        </Button>
      ) : code !== "RATE_LIMITED" ? (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RotateCwIcon /> Retry
        </Button>
      ) : null}
    </div>
  );
}
