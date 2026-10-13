import { FileSearchIcon, ScaleIcon, ShieldCheckIcon } from "lucide-react";

const STEPS = [
  {
    icon: FileSearchIcon,
    title: "Investigates",
    body: "Looks up the customer's own orders, refunds and payments with real tools.",
  },
  {
    icon: ScaleIcon,
    title: "Explains",
    body: "Answers only from what the records show, and says when it can't verify.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Confirms first",
    body: "Proposes a support ticket. Nothing is created until the customer says yes.",
  },
];

export function DemoHero() {
  return (
    <div className="space-y-5">
      <p className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
        <span className="size-1.5 rounded-full bg-brand" aria-hidden />
        Live demo · Gemini-powered agent
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Support answers grounded in real records.
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
        ResolveAI is an AI support agent that investigates a customer&apos;s orders, refunds and
        payments, explains what it found, and opens a ticket only after they confirm.
      </p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
      {STEPS.map(({ icon: Icon, title, body }, index) => (
        <li key={title} className="flex flex-col gap-2 bg-card p-5">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-brand" aria-hidden />
            <span className="text-sm font-medium">
              <span className="sr-only">Step {index + 1}: </span>
              {title}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
        </li>
      ))}
    </ol>
  );
}
