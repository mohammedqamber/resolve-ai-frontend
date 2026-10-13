"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { useBackendHealth } from "../hooks/useBackendHealth";

const STATES = {
  pending: {
    label: "Connecting",
    dot: "bg-warning animate-pulse",
    tip: "The free-tier demo server can take up to a minute to wake up.",
  },
  success: {
    label: "Agent online",
    dot: "bg-success",
    tip: "The ResolveAI backend is awake and responding.",
  },
  error: {
    label: "Server unreachable",
    dot: "bg-destructive",
    tip: "Click to check again.",
  },
} as const;

export function BackendStatus({ className }: { className?: string }) {
  const health = useBackendHealth();
  const state = STATES[health.status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => health.refetch()}
          disabled={health.isFetching}
          className={cn(
            "inline-flex h-7 items-center gap-2 rounded-full border bg-background px-2.5 text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default",
            className,
          )}
        >
          <span className={cn("size-1.5 rounded-full", state.dot)} aria-hidden />
          <span role="status">{state.label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>{state.tip}</TooltipContent>
    </Tooltip>
  );
}
