import { apiRequest } from "@/lib/apiClient";

import type { TicketsResponse } from "../types";

export function fetchTickets() {
  return apiRequest<TicketsResponse>("/api/tickets");
}
