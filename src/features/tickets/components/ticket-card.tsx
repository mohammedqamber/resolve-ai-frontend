import { CalendarIcon, FileTextIcon, PackageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import { getCategoryLabel, getStatusLabel } from "../ticketLabels";
import type { Ticket } from "../types";

export function TicketStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        status === "open" && "border-success/30 bg-success-soft text-success",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {getStatusLabel(status)}
    </Badge>
  );
}

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <article
      aria-labelledby={`ticket-${ticket.ticketId}`}
      className="space-y-3 rounded-xl border bg-card p-4 shadow-xs"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 id={`ticket-${ticket.ticketId}`} className="font-mono text-sm font-semibold">
            {ticket.ticketId}
          </h3>
          <p className="text-xs font-medium text-muted-foreground">
            {getCategoryLabel(ticket.category)}
          </p>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </header>

      <p className="text-sm leading-relaxed text-pretty">{ticket.summary}</p>

      {ticket.evidence.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Evidence</p>
          <ul className="space-y-1">
            {ticket.evidence.map((item) => (
              <li key={item} className="flex gap-2 text-xs leading-relaxed">
                <FileTextIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="font-mono break-words">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <PackageIcon className="size-3.5" aria-hidden />
          <span className="font-mono">{ticket.orderId}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="size-3.5" aria-hidden />
          <time dateTime={ticket.createdAt}>{formatDateTime(ticket.createdAt)}</time>
        </span>
      </footer>
    </article>
  );
}
