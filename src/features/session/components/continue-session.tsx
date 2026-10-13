import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import type { SessionInfo } from "../types";
import { ProfileAvatar } from "./profile-avatar";

export function ContinueSession({ session }: { session: SessionInfo }) {
  return (
    <Link
      href="/chat"
      className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs transition-colors outline-none hover:border-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ProfileAvatar profile={session.profile} name={session.name} />
      <span className="min-w-0 flex-1 text-sm">
        <span className="block font-medium">Continue as {session.name}</span>
        <span className="block text-muted-foreground">Pick up your open investigations.</span>
      </span>
      <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
