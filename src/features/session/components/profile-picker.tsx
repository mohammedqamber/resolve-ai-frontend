"use client";

import { ArrowRightIcon, ArrowUpRightIcon, Loader2Icon, RotateCwIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNow } from "@/hooks/useNow";
import { getErrorMessage } from "@/lib/errors";

import { useProfiles } from "../hooks/useProfiles";
import { useStartSession } from "../hooks/useStartSession";
import { getScenario } from "../scenarios";
import type { ProfileId } from "../types";
import { ProfileCard } from "./profile-card";

const COLD_START_HINT_AFTER_MS = 4000;

export function ProfilePicker({ initialProfile }: { initialProfile?: ProfileId }) {
  const profiles = useProfiles();
  const startSession = useStartSession();
  const [selectedId, setSelectedId] = useState<ProfileId>(initialProfile ?? "alice");

  const now = useNow(startSession.isPending);
  const showColdStartHint =
    startSession.isPending &&
    now !== null &&
    now - startSession.submittedAt > COLD_START_HINT_AFTER_MS;

  if (profiles.isPending) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <p className="text-sm text-muted-foreground" role="status">
          Loading demo customers… The demo server may take up to a minute to wake up.
        </p>
      </div>
    );
  }

  if (profiles.isError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed bg-card p-6">
        <p className="text-sm font-medium">Couldn&apos;t load the demo customers</p>
        <p className="text-sm text-muted-foreground">{getErrorMessage(profiles.error)}</p>
        <Button variant="outline" size="sm" onClick={() => profiles.refetch()}>
          <RotateCwIcon /> Try again
        </Button>
      </div>
    );
  }

  const selected = profiles.data.find((p) => p.profile === selectedId) ?? profiles.data[0];
  const scenario = selected ? getScenario(selected.profile) : undefined;
  const pendingPrompt = startSession.isPending ? startSession.variables.prompt : undefined;

  const start = (prompt?: string) => {
    if (selected) startSession.mutate({ profile: selected.profile, prompt });
  };

  if (profiles.data.length === 0) {
    return (
      <div className="space-y-3 rounded-xl border border-dashed p-6" role="status">
        <p className="text-sm text-muted-foreground">No demo customers are available yet. Please try again.</p>
        <Button variant="outline" onClick={() => profiles.refetch()}><RotateCwIcon /> Refresh customers</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Demo customers" className="grid gap-3 sm:grid-cols-3">
        {profiles.data.map((profile) => (
          <ProfileCard
            key={profile.profile}
            profile={profile}
            selected={profile.profile === selected?.profile}
            disabled={startSession.isPending}
            onSelect={() => setSelectedId(profile.profile)}
          />
        ))}
      </div>

      {selected && (
        <div className="overflow-hidden rounded-2xl border bg-card">
          {scenario && (
            <div className="p-2">
              <p className="px-3 pt-3 pb-2 text-sm font-semibold">
                Try asking as {selected.name}
              </p>
              <ul>
                {scenario.examples.map((example) => (
                  <li key={example.prompt}>
                    <button
                      type="button"
                      disabled={startSession.isPending}
                      onClick={() => start(example.prompt)}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left transition-colors outline-none hover:bg-brand-soft/60 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-6 font-medium">{example.prompt}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{example.hint}</span>
                      </span>
                      {pendingPrompt === example.prompt ? (
                        <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                      ) : (
                        <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" aria-hidden />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t bg-canvas px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground" role="status">
              {startSession.isError
                ? getErrorMessage(startSession.error)
                : showColdStartHint
                  ? "Waking up the demo server. This can take up to a minute…"
                  : "No signup. Fictional data only."}
            </p>
            <Button
              size="lg"
              className="h-11 rounded-xl px-5"
              disabled={startSession.isPending}
              onClick={() => start()}
            >
              {startSession.isPending && !pendingPrompt ? (
                <Loader2Icon className="animate-spin" />
              ) : null}
              Start as {selected.name}
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
