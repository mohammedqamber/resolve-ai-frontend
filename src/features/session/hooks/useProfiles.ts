import { useQuery } from "@tanstack/react-query";

import { fetchProfiles } from "../api/sessionApi";

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    select: (data) => data.profiles,
    staleTime: Infinity,
    retry: 2,
  });
}
