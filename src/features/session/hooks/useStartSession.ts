import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createSession } from "../api/sessionApi";
import type { ProfileId } from "../types";

type StartSessionInput = { profile: ProfileId; prompt?: string };

/** Creates a session (token stored in an httpOnly cookie) and opens the workspace. */
export function useStartSession() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ profile }: StartSessionInput) => createSession(profile),
    onSuccess: (_session, { prompt }) => {
      router.push(prompt ? `/chat?prompt=${encodeURIComponent(prompt)}` : "/chat");
    },
  });
}
