import { useQuery } from "@tanstack/react-query";

import { fetchTickets } from "../api/ticketsApi";

export const ticketsQueryKey = (profile: string) => ["tickets", profile] as const;

/** Tickets of the session's customer (GET /api/tickets), oldest first. */
export function useTickets(profile: string) {
  return useQuery({
    queryKey: ticketsQueryKey(profile),
    queryFn: fetchTickets,
    select: (data) => data.tickets,
    staleTime: 30_000,
  });
}
