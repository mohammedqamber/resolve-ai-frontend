const CATEGORY_LABELS: Record<string, string> = {
  refund_issue: "Refund issue",
  payment_issue: "Payment issue",
  delivery_issue: "Delivery issue",
  other: "Other",
};

/** Unknown future categories render as their raw value (contract 5). */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function getStatusLabel(status: string): string {
  return status === "open" ? "Open" : status;
}

const TICKET_ID_PATTERN = /\bTCK-\d+\b/g;

/** Ticket IDs mentioned in an assistant reply (the chat response has no ticket object). */
export function extractTicketIds(text: string): string[] {
  return [...new Set(text.match(TICKET_ID_PATTERN) ?? [])];
}
