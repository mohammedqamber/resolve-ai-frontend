"use client";

import { useNow } from "@/hooks/useNow";

import { AssistantAvatar } from "./message-item";

// Replies are not streamed (contract 1), so this only reflects elapsed time.
// It never invents tool calls or reasoning steps.
function describe(seconds: number) {
  if (seconds < 10) return "Investigating…";
  if (seconds < 40)
    return "Still working. The agent may be checking several records…";
  return "Taking longer than usual. The server may be waking up…";
}

export function AgentWorking({ since }: { since: number }) {
  const now = useNow(true);
  const seconds =
    now === null ? 0 : Math.max(0, Math.floor((now - since) / 1000));

  return (
    <div className="flex gap-3" role="status" aria-live="polite">
      <AssistantAvatar />
      <div className="flex min-h-6 items-center gap-3 text-sm text-muted-foreground">
        <span className="flex gap-1" aria-hidden>
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="size-1.5 animate-bounce rounded-full bg-brand/70"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
        <span>{describe(seconds)}</span>
        {seconds >= 3 && (
          <span className="font-mono text-xs tabular-nums" aria-hidden>
            {seconds}s
          </span>
        )}
      </div>
    </div>
  );
}
