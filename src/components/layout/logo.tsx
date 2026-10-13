import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-7 shrink-0", className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <circle cx="14.5" cy="14.5" r="6" fill="none" stroke="white" strokeWidth="2.4" />
      <path d="M19 19l5 5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="14.5" cy="14.5" r="2" className="fill-[oklch(0.75_0.14_275)]" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight">
        ResolveAI <span className="font-normal text-muted-foreground">Lite</span>
      </span>
    </Link>
  );
}
