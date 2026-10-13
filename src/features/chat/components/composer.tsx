"use client";

import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNow } from "@/hooks/useNow";
import { cn } from "@/lib/utils";

import { MAX_MESSAGE_LENGTH } from "../constants";

type ComposerProps = {
  onSend: (message: string) => void;
  isSending: boolean;
  rateLimitedUntil: number | null;
  initialValue?: string;
};

const COUNTER_VISIBLE_FROM = 800;

export function Composer({ onSend, isSending, rateLimitedUntil, initialValue = "" }: ComposerProps) {
  const [value, setValue] = useState(initialValue);

  const now = useNow(rateLimitedUntil !== null);
  // Until the clock's first tick, treat an active rate limit as still running.
  const isRateLimited = rateLimitedUntil !== null && (now === null || now < rateLimitedUntil);
  const waitSeconds =
    rateLimitedUntil !== null && now !== null
      ? Math.max(0, Math.ceil((rateLimitedUntil - now) / 1000))
      : 0;

  const length = value.trim().length;
  const tooLong = length > MAX_MESSAGE_LENGTH;
  const canSend = length > 0 && !tooLong && !isSending && !isRateLimited;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(value);
    setValue("");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border bg-background shadow-sm transition-shadow focus-within:border-ring/60 focus-within:ring-3 focus-within:ring-ring/15"
    >
      <label htmlFor="chat-message" className="sr-only">
        Message
      </label>
      <Textarea
        id="chat-message"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Describe the problem, e.g. “My refund hasn't arrived”"
        autoFocus
        rows={1}
        aria-invalid={tooLong || undefined}
        aria-describedby="composer-hint"
        className="max-h-48 min-h-12 resize-none border-0 bg-transparent px-4 pt-3.5 text-[15px] shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      <div className="flex items-center gap-3 px-3 pb-2.5">
        <p id="composer-hint" className="min-w-0 flex-1 truncate text-xs text-muted-foreground" aria-live="polite">
          {waitSeconds > 0 ? (
            <span className="text-warning">Rate limit reached. You can send again in {waitSeconds}s.</span>
          ) : (
            <span className="hidden sm:inline">Enter to send · Shift + Enter for a new line</span>
          )}
        </p>
        {length >= COUNTER_VISIBLE_FROM && (
          <span
            className={cn(
              "font-mono text-xs tabular-nums",
              tooLong ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {length}/{MAX_MESSAGE_LENGTH}
          </span>
        )}
        <Button type="submit" size="icon" disabled={!canSend} aria-label="Send message" className="rounded-lg">
          {isSending ? <Loader2Icon className="animate-spin" /> : <ArrowUpIcon />}
        </Button>
      </div>
    </form>
  );
}
