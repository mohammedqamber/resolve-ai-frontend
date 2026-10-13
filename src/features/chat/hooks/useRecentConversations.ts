import { useCallback } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { truncate } from "@/lib/format";

import type { RecentConversation } from "../types";

const MAX_RECENTS = 20;
const EMPTY: RecentConversation[] = [];

/**
 * The backend has no "list conversations" endpoint (contract 9.3), so the
 * conversation IDs this browser started are remembered locally, per profile.
 */
export function useRecentConversations(profile: string) {
  const [recents, setRecents] = useLocalStorage(`resolveai:conversations:${profile}`, EMPTY);

  const touch = useCallback(
    (id: string, firstMessage: string) =>
      setRecents((previous) => {
        const existing = previous.find((c) => c.id === id);
        const entry: RecentConversation = {
          id,
          title: existing?.title ?? truncate(firstMessage, 80),
          updatedAt: Date.now(),
        };
        return [entry, ...previous.filter((c) => c.id !== id)].slice(0, MAX_RECENTS);
      }),
    [setRecents],
  );

  const remove = useCallback(
    (id: string) => setRecents((previous) => previous.filter((c) => c.id !== id)),
    [setRecents],
  );

  return { recents, touch, remove };
}
