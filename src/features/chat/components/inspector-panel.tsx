"use client";

import { ActivityIcon, HistoryIcon, Loader2Icon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketList } from "@/features/tickets/components/ticket-list";
import { useTickets } from "@/features/tickets/hooks/useTickets";
import { truncate } from "@/lib/format";

import type { Activity, ChatMessage } from "../types";
import { ActivityList } from "./activity-list";

type Turn = { id: string; question: string; activities: Activity[] };

/** Pairs each assistant reply's activities with the question that triggered it. */
function toTurns(messages: ChatMessage[]): Turn[] {
  const turns: Turn[] = [];
  let question = "";
  for (const message of messages) {
    if (message.role === "user") question = message.text;
    else if (message.activities?.length) {
      turns.push({ id: message.id, question, activities: message.activities });
    }
  }
  return turns.reverse(); // Newest investigation first.
}

type InspectorPanelProps = {
  profile: string;
  messages: ChatMessage[];
  historyActivities: Activity[];
  isSending: boolean;
};

export function InspectorPanel({ profile, messages, historyActivities, isSending }: InspectorPanelProps) {
  const turns = toTurns(messages);
  const tickets = useTickets(profile);
  const activityCount =
    turns.reduce((sum, turn) => sum + turn.activities.length, 0) + historyActivities.length;

  return (
    <Tabs defaultValue="activity" className="flex h-full min-h-0 flex-col gap-0">
      <div className="border-b px-4 py-3">
        <TabsList className="w-full">
          <TabsTrigger value="activity">
            Agent activity <Count value={activityCount} />
          </TabsTrigger>
          <TabsTrigger value="tickets">
            Tickets <Count value={tickets.data?.length ?? 0} />
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="activity" className="min-h-0 overflow-y-auto p-4">
        <div className="space-y-5">
          {isSending && (
            <p
              role="status"
              className="flex items-start gap-2 rounded-lg border border-dashed bg-canvas p-3 text-xs leading-relaxed text-muted-foreground"
            >
              <Loader2Icon className="mt-px size-3.5 shrink-0 animate-spin" aria-hidden />
              The agent is working. Its tool calls appear here once the reply arrives.
            </p>
          )}

          {turns.map((turn, index) => (
            <section key={turn.id} className="space-y-2">
              <header className="space-y-0.5 px-1">
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Turn {turns.length - index}
                </p>
                <p className="text-sm leading-snug">{truncate(turn.question, 120)}</p>
              </header>
              <ActivityList activities={turn.activities} />
            </section>
          ))}

          {historyActivities.length > 0 && (
            <section className="space-y-2">
              <header className="space-y-0.5 px-1">
                <p className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  <HistoryIcon className="size-3" aria-hidden /> Earlier in this conversation
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Restored from saved history. These steps aren&apos;t linked to individual messages.
                </p>
              </header>
              <ActivityList activities={historyActivities} />
            </section>
          )}

          {activityCount === 0 && !isSending && (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center">
              <span className="flex size-9 items-center justify-center rounded-full bg-muted">
                <ActivityIcon className="size-4 text-muted-foreground" aria-hidden />
              </span>
              <p className="text-sm font-medium">No agent activity yet</p>
              <p className="max-w-60 text-xs leading-relaxed text-muted-foreground">
                Every real lookup the agent runs on orders, refunds and payments shows up here
                with its inputs, result and timing.
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="tickets" className="min-h-0 overflow-y-auto p-4">
        <TicketList profile={profile} />
      </TabsContent>
    </Tabs>
  );
}

function Count({ value }: { value: number }) {
  if (value === 0) return null;
  return (
    <span className="rounded-full bg-muted px-1.5 font-mono text-[10px] text-muted-foreground tabular-nums">
      {value}
    </span>
  );
}
