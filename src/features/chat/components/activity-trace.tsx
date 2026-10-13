"use client";

import { ChevronDownIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { durationBetween, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

import { getStatusMeta, getToolMeta } from "../activityMeta";
import type { Activity } from "../types";
import { ActivityList } from "./activity-list";

/** Wall-clock span from the first step's start to the last step's end. */
function totalDuration(activities: Activity[]) {
  const first = activities[0];
  const last = activities.at(-1);
  return first && last ? durationBetween(first.startedAt, last.completedAt) : undefined;
}

/** The real tool calls behind one assistant reply, shown inline in the thread. */
export function ActivityTrace({ activities }: { activities: Activity[] }) {
  const duration = totalDuration(activities);

  return (
    <Collapsible className="group/trace rounded-xl border bg-canvas">
      <CollapsibleTrigger className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-3 py-2 text-left outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="text-xs font-medium text-muted-foreground">
          {activities.length} agent {activities.length === 1 ? "step" : "steps"}
          {duration !== undefined && <> · {formatDuration(duration)}</>}
        </span>
        <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {activities.map((activity, index) => {
            const tool = getToolMeta(activity.tool);
            const status = getStatusMeta(activity.status);
            const StatusIcon = status.icon;
            return (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-md border bg-background px-1.5 py-0.5 text-[11px] font-medium"
              >
                <StatusIcon className={cn("size-3", status.className)} aria-hidden />
                {tool.label}
                <span className="sr-only">: {status.label}</span>
              </span>
            );
          })}
        </span>
        <ChevronDownIcon
          className="ml-auto size-4 text-muted-foreground transition-transform group-data-[state=open]/trace:rotate-180"
          aria-hidden
        />
        <span className="sr-only">Show step details</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t p-1.5">
        <ActivityList activities={activities} />
      </CollapsibleContent>
    </Collapsible>
  );
}
