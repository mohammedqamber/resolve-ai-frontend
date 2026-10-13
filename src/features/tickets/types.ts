// Types from the ResolveAI API contract (section 5).

export type TicketCategory =
  | "refund_issue"
  | "payment_issue"
  | "delivery_issue"
  | "other";

export type Ticket = {
  ticketId: string;
  orderId: string;
  // Unknown future values are rendered as plain text.
  category: TicketCategory | (string & {});
  summary: string;
  evidence: string[];
  status: "open" | (string & {});
  createdAt: string;
};

export type TicketsResponse = { tickets: Ticket[] };
