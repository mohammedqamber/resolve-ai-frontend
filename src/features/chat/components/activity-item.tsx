"use client";

import { ChevronRightIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { durationBetween, formatDuration, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import { getStatusMeta, getToolMeta } from "../activityMeta";
import type { Activity } from "../types";

export function ActivityItem({ activity }: { activity: Activity }) {
  const tool = getToolMeta(activity.tool);
  const status = getStatusMeta(activity.status);
  const duration = durationBetween(activity.startedAt, activity.completedAt);
  const ToolIcon = tool.icon;
  const StatusIcon = status.icon;

  return (
    <Collapsible asChild>
      <li className="group/item rounded-lg transition-colors data-[state=open]:bg-muted/60">
        <CollapsibleTrigger className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50">
          <StatusIcon
            className={cn("size-4 shrink-0", status.className, status.spin && "animate-spin")}
            aria-label={status.label}
          />
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <ToolIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="shrink-0 text-[13px] font-medium">{tool.label}</span>
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {activity.inputSummary}
            </span>
          </span>
          {duration !== undefined && (
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
              {formatDuration(duration)}
            </span>
          )}
          <ChevronRightIcon
            className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/item:rotate-90"
            aria-hidden
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <dl className="grid grid-cols-[88px_1fr] gap-x-3 gap-y-1.5 px-2.5 pt-1 pb-3 pl-9 text-xs">
            <Detail label="Tool">
              <span className="font-mono">{activity.tool}</span>
              <span className="text-muted-foreground"> · {tool.description}</span>
            </Detail>
            <Detail label="Status">
              <span className={status.className}>{status.label}</span>
            </Detail>
            <Detail label="Input">
              <span className="font-mono break-all">{activity.inputSummary || "—"}</span>
            </Detail>
            <Detail label="Output">
              <span className="font-mono break-all">{activity.outputSummary ?? "—"}</span>
            </Detail>
            <Detail label="Started">
              <span className="tabular-nums">{formatTime(activity.startedAt)}</span>
            </Detail>
            <Detail label="Duration">
              <span className="tabular-nums">
                {duration !== undefined ? formatDuration(duration) : "Not finished"}
              </span>
            </Detail>
          </dl>
        </CollapsibleContent>
      </li>
    </Collapsible>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </>
  );
}
