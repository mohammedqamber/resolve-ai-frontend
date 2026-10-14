import { ArrowDownIcon, ArrowRightIcon, CheckIcon, FileSearchIcon, ScaleIcon, ShieldCheckIcon } from "lucide-react";

const STEPS = [
  { icon: FileSearchIcon, title: "Find the facts.", body: "The agent checks the customer's orders, payments, and refunds to understand what happened." },
  { icon: ScaleIcon, title: "Make it make sense.", body: "Get a clear explanation grounded in the records, including what the agent can't verify." },
  { icon: ShieldCheckIcon, title: "You decide what's next.", body: "Need more help? Review a proposed support ticket. It's only created with your confirmation." },
];

export function DemoHero() {
  return (
    <section aria-labelledby="hero-heading" className="grid items-center gap-12 pt-12 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div>
        <p className="mb-7 inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.14em] text-brand uppercase">
          <span className="size-2 rounded-full bg-brand" aria-hidden /> An AI support investigation agent
        </p>
        <h1 id="hero-heading" className="max-w-xl text-[clamp(2.8rem,5.5vw,4.7rem)] leading-[1.06] font-semibold tracking-[-0.055em]">
          Every question<br />deserves a<br /><span className="text-brand">clear answer.</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          A missing refund. A mystery charge. An order that never arrived. ResolveAI connects the records so you can see the whole story.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <a href="#try-demo" className="inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/10 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">Try the live demo <ArrowRightIcon className="size-4" aria-hidden /></a>
          <a href="#how-it-works" className="inline-flex items-center gap-2 rounded text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4">See how it works <ArrowDownIcon className="size-4" aria-hidden /></a>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">No signup. Fictional customers. Real investigation tools.</p>
      </div>
      <InvestigationPreview />
    </section>
  );
}

function InvestigationPreview() {
  return (
    <figure className="relative rounded-[2rem] border border-[#e8e5f5] bg-[#eeecf8] p-5 sm:p-8">
      <figcaption className="mb-6 flex items-center justify-between gap-3 text-[10px] font-semibold tracking-[0.16em] text-[#68617f] uppercase"><span>From question to clarity</span><span>Illustrative example</span></figcaption>
      <div className="relative rounded-2xl border border-white bg-white p-5 shadow-[0_20px_60px_-30px_#534a80] sm:p-6">
        <div className="flex items-center gap-3 border-b pb-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand" aria-hidden>A</span>
          <div><p className="text-xs font-medium text-muted-foreground">Alice asks</p><p className="mt-1 text-sm font-medium">“Where is my refund?”</p></div>
        </div>
        <div className="py-5">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold text-brand"><FileSearchIcon className="size-4" aria-hidden /> Following the evidence</p>
          <ol className="space-y-4 border-l border-brand/15 pl-4 text-sm">
            <li className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Order record</span><span className="flex items-center gap-1.5 text-xs font-medium"><CheckIcon className="size-3.5 text-success" aria-hidden /> Returned</span></li>
            <li className="flex items-center justify-between gap-3"><span className="text-muted-foreground">Refund record</span><span className="text-xs font-medium">Transfer failed</span></li>
          </ol>
        </div>
        <div className="rounded-xl bg-[#f6f5fb] p-4">
          <p className="mb-2 text-xs font-semibold text-brand">The picture is clearer.</p>
          <p className="text-sm leading-6 text-[#555168]">Your return was received, but the refund transfer failed. I can open a support ticket to have this investigated.</p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheckIcon className="size-4 shrink-0 text-brand" aria-hidden /> Nothing is submitted without your confirmation.</div>
      </div>
      <p className="mt-6 text-center text-xs text-[#68617f]">Connected records. Clear explanations. You in control.</p>
    </figure>
  );
}

export function HowItWorks() {
  return (
    <ol className="grid gap-8 sm:grid-cols-3">
      {STEPS.map(({ icon: Icon, title, body }, index) => (
        <li key={title} className="border-t pt-6">
          <div className="mb-5 flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-xl border bg-white"><Icon className="size-5 text-brand" aria-hidden /></span><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span></div>
          <h3 className="mb-3 text-lg font-semibold tracking-tight">{title}</h3>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">{body}</p>
        </li>
      ))}
    </ol>
  );
}
