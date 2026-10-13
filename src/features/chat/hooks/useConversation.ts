import { useQuery } from "@tanstack/react-query";

import { fetchConversation } from "../api/chatApi";

/** Loads a saved conversation once, to restore it (GET /api/conversations/:id). */
export function useConversation(profile: string, id: string) {
  return useQuery({
    queryKey: ["conversation", profile, id],
    queryFn: () => fetchConversation(id),
    // The live chat state takes over after the restore; never serve stale history.
    gcTime: 0,
  });
}
