import { Suspense } from "react";

import { Logo } from "@/components/layout/logo";
import { BackendStatus } from "@/features/session/components/backend-status";
import { ContinueSession } from "@/features/session/components/continue-session";
import { DemoHero, HowItWorks } from "@/features/session/components/demo-intro";
import { ProfilePicker } from "@/features/session/components/profile-picker";
import { getSessionInfo } from "@/lib/server/resolveApi";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#f8f9fc] text-[#202334]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
        <Logo />
        <div className="flex items-center gap-8">
          <a href="#how-it-works" className="hidden rounded text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 sm:block">How it works</a>
          <BackendStatus />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        <DemoHero />

        <section id="try-demo" aria-labelledby="choose-customer" className="scroll-mt-8 space-y-7 rounded-3xl border border-white bg-white/80 p-5 shadow-[0_12px_60px_-30px_#55608040] sm:p-9">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-brand uppercase">Your turn to investigate</p>
            <h2 id="choose-customer" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              A customer. A question. Let’s resolve it.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Choose a demo customer, then ask about an order, payment, or refund.
            </p>
          </div>
          <Suspense fallback={<ProfilePicker />}>
            <SessionAwarePicker />
          </Suspense>
        </section>

        <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-8 pt-20">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-brand uppercase">Behind every answer</p>
          <h2 id="how-heading" className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">
            Less guessing. More understanding.
          </h2>
          <HowItWorks />
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-4 border-t px-5 py-7 text-xs leading-5 text-muted-foreground sm:flex-row sm:px-8">
        <span className="font-medium">ResolveAI Lite · Thoughtful support, backed by evidence.</span>
        <p className="max-w-sm">Demo only. All customers, orders, and payments are fictional. AI answers are generated from seeded records.</p>
      </footer>
    </div>
  );
}

async function SessionAwarePicker() {
  const session = await getSessionInfo();

  return (
    <div className="space-y-4">
      {session && <ContinueSession session={session} />}
      <ProfilePicker initialProfile={session?.profile} />
    </div>
  );
}
