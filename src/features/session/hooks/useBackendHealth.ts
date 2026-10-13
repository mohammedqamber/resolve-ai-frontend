import { useQuery } from "@tanstack/react-query";

import { fetchHealth } from "../api/sessionApi";

/** Pings GET /health. Also wakes a sleeping free-tier server early. */
export function useBackendHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    staleTime: 5 * 60_000,
    retry: 2,
  });
}
