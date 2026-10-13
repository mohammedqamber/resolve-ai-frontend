import { ArrowLeftRightIcon, MessageSquareIcon, SquarePenIcon } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/features/session/components/profile-avatar";
import type { SessionInfo } from "@/features/session/types";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { RecentConversation } from "../types";

type ConversationSidebarProps = {
  session: SessionInfo;
  recents: RecentConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
};

export function ConversationSidebar({
  session,
  recents,
  activeId,
  onSelect,
  onNew,
}: ConversationSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-4 pb-3">
        <Logo />
      </div>

      <div className="px-3">
        <Button variant="outline" className="h-9 w-full justify-start bg-background" onClick={onNew}>
          <SquarePenIcon /> New investigation
        </Button>
      </div>

      <nav aria-label="Recent conversations" className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">Recent</p>
        {recents.length === 0 ? (
          <p className="px-2 text-xs leading-relaxed text-muted-foreground">
            Conversations you start are remembered in this browser.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {recents.map((conversation) => {
              const active = conversation.id === activeId;
              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                      active && "bg-background shadow-xs ring-1 ring-border hover:bg-background",
                    )}
                  >
                    <MessageSquareIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px]">{conversation.title}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {formatRelative(conversation.updatedAt)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <div className="flex items-center gap-2.5 border-t px-4 py-3">
        <ProfileAvatar profile={session.profile} name={session.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{session.name}</p>
          <p className="text-xs text-muted-foreground">Demo customer</p>
        </div>
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/" aria-label="Switch demo customer" title="Switch demo customer">
            <ArrowLeftRightIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
}
