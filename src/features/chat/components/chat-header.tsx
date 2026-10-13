import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BackendStatus } from "@/features/session/components/backend-status";

type ChatHeaderProps = {
  title: string;
  conversationId?: string | null;
  onOpenSidebar: () => void;
  /** Right-side actions, e.g. the mobile inspector trigger. */
  actions?: React.ReactNode;
};

export function ChatHeader({ title, conversationId, onOpenSidebar, actions }: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onOpenSidebar}
        aria-label="Open conversations"
      >
        <MenuIcon />
      </Button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-medium">{title}</h1>
        {conversationId && (
          <p className="truncate font-mono text-[11px] text-muted-foreground">{conversationId}</p>
        )}
      </div>
      <BackendStatus className="hidden sm:inline-flex" />
      {actions}
    </header>
  );
}
