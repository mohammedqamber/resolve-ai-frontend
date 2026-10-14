import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { getScenario } from "../scenarios";
import type { Profile } from "../types";
import { ProfileAvatar } from "./profile-avatar";

type ProfileCardProps = {
  profile: Profile;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

export function ProfileCard({ profile, selected, disabled, onSelect }: ProfileCardProps) {
  const scenario = getScenario(profile.profile);

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border bg-card p-5 text-left transition-colors outline-none",
        "hover:border-foreground/20 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60",
        selected && "border-brand/60 bg-brand-soft/40 ring-3 ring-brand/10 hover:border-brand/60",
      )}
    >
      <div className="flex items-center gap-3">
        <ProfileAvatar profile={profile.profile} name={profile.name} className="size-9" />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{profile.name}</p>
          <p className="text-xs text-muted-foreground">Demo customer</p>
        </div>
        <span
          aria-hidden
          className={cn(
            "ml-auto flex size-5 items-center justify-center rounded-full border transition-colors",
            selected ? "border-brand bg-brand text-white" : "bg-background text-transparent",
          )}
        >
          <CheckIcon className="size-3" strokeWidth={3} />
        </span>
      </div>
      {scenario && (
        <p className="text-sm leading-6 text-muted-foreground">{scenario.summary}</p>
      )}
    </button>
  );
}
