"use client";

import { TicketIcon } from "lucide-react";

import { useTickets } from "../hooks/useTickets";
import { extractTicketIds, getCategoryLabel } from "../ticketLabels";
import { TicketStatusBadge } from "./ticket-card";

/**
 * Shows real ticket records for ticket IDs mentioned in a reply. Data comes
 * from GET /api/tickets; IDs that aren't in the customer's list are ignored.
 */
export function TicketReferences({ profile, text }: { profile: string; text: string }) {
  const ids = extractTicketIds(text);
  const tickets = useTickets(profile);

  if (ids.length === 0 || !tickets.data) return null;
  const matches = tickets.data.filter((ticket) => ids.includes(ticket.ticketId));

  return matches.map((ticket) => (
    <div
      key={ticket.ticketId}
      className="flex animate-in items-center gap-3 rounded-xl border bg-card px-3 py-2.5 shadow-xs duration-300 fade-in-0"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <TicketIcon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-mono font-semibold">{ticket.ticketId}</span>
          <span className="text-muted-foreground"> · {getCategoryLabel(ticket.category)}</span>
        </p>
        <p className="truncate text-xs text-muted-foreground">
          Order <span className="font-mono">{ticket.orderId}</span> · {ticket.summary}
        </p>
      </div>
      <TicketStatusBadge status={ticket.status} />
    </div>
  ));
}
