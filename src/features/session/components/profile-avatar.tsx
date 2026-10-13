import { cn } from "@/lib/utils";

const TINTS: Record<string, string> = {
  alice: "bg-[oklch(0.94_0.04_275)] text-[oklch(0.42_0.17_275)]",
  ben: "bg-[oklch(0.94_0.045_185)] text-[oklch(0.42_0.09_185)]",
  chloe: "bg-[oklch(0.95_0.05_60)] text-[oklch(0.48_0.12_55)]",
};

type ProfileAvatarProps = {
  profile: string;
  name: string;
  className?: string;
};

export function ProfileAvatar({ profile, name, className }: ProfileAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
        TINTS[profile] ?? "bg-muted text-foreground",
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
