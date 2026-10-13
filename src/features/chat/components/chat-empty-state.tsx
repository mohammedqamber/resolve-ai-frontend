import { ArrowUpRightIcon } from "lucide-react";

import { LogoMark } from "@/components/layout/logo";
import { getScenario } from "@/features/session/scenarios";
import type { SessionInfo } from "@/features/session/types";

type ChatEmptyStateProps = {
  session: SessionInfo;
  disabled: boolean;
  onPick: (prompt: string) => void;
};

export function ChatEmptyState({ session, disabled, onPick }: ChatEmptyStateProps) {
  const scenario = getScenario(session.profile);
  const firstName = session.name.split(" ")[0];

  return (
    <div className="flex min-h-0 flex-1 overflow-y-auto">
      <div className="m-auto w-full max-w-2xl space-y-8 px-4 py-10 sm:px-6">
        <div className="space-y-3 text-center">
          <LogoMark className="mx-auto size-10" />
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            What should we investigate, {firstName}?
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-pretty text-muted-foreground">
            The agent checks your real orders, refunds and payments, explains what it finds, and
            can propose a support ticket.
          </p>
        </div>

        {scenario && (
          <ul className="grid gap-2 sm:grid-cols-2" aria-label="Example questions">
            {scenario.examples.map((example) => (
              <li key={example.prompt}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onPick(example.prompt)}
                  className="group flex h-full w-full items-start gap-3 rounded-xl border bg-card p-3.5 text-left shadow-xs transition-all outline-none hover:border-foreground/20 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
                >
                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="block text-sm leading-snug">{example.prompt}</span>
                    <span className="block text-xs text-muted-foreground">{example.hint}</span>
                  </span>
                  <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
