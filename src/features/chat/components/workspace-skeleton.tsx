import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceSkeleton() {
  return (
    <div className="flex h-dvh bg-canvas" aria-busy="true" aria-label="Loading workspace">
      <div className="hidden w-64 shrink-0 space-y-4 p-4 md:block">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-9 w-full" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 md:py-2 md:pr-2">
        <div className="flex flex-1 flex-col bg-background md:rounded-xl md:border">
          <div className="h-14 border-b" />
          <div className="m-auto w-full max-w-2xl space-y-4 px-6">
            <Skeleton className="mx-auto size-10 rounded-lg" />
            <Skeleton className="mx-auto h-7 w-72" />
            <div className="grid gap-2 sm:grid-cols-2">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>
          <div className="mx-auto w-full max-w-3xl px-6 pb-4">
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
