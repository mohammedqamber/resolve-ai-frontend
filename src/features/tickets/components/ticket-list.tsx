"use client";

import { RotateCwIcon, TicketIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

import { useTickets } from "../hooks/useTickets";
import { TicketCard } from "./ticket-card";

export function TicketList({ profile }: { profile: string }) {
  const tickets = useTickets(profile);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {tickets.data ? `${tickets.data.length} for this customer` : "Support tickets"}
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => tickets.refetch()}
          disabled={tickets.isFetching}
          aria-label="Refresh tickets"
        >
          <RotateCwIcon className={cn(tickets.isFetching && "animate-spin")} />
        </Button>
      </div>

      {tickets.isPending ? (
        <div className="space-y-3" aria-busy="true" aria-label="Loading tickets">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      ) : tickets.isError ? (
        <div role="alert" className="space-y-3 rounded-xl border border-dashed p-5 text-center">
          <p className="text-sm text-muted-foreground">{getErrorMessage(tickets.error)}</p>
          <Button variant="outline" size="sm" onClick={() => tickets.refetch()}>
            Try again
          </Button>
        </div>
      ) : tickets.data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-muted">
            <TicketIcon className="size-4 text-muted-foreground" aria-hidden />
          </span>
          <p className="text-sm font-medium">No tickets yet</p>
          <p className="max-w-60 text-xs leading-relaxed text-muted-foreground">
            When the agent finds a problem it proposes a ticket. It&apos;s only created after you
            confirm.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {/* The API lists oldest first; show the newest on top. */}
          {[...tickets.data].reverse().map((ticket) => (
            <li key={ticket.ticketId}>
              <TicketCard ticket={ticket} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
