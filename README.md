# ResolveAI Lite — Frontend

A chat workspace for **ResolveAI**, an AI customer-support investigation agent. Pick a demo customer, describe a problem, and watch the agent look up real (seeded) order, refund and payment records, explain what it found, and propose a support ticket that is only created after you confirm.

The backend (a Gemini agent) is a separate, already-deployed service. This app follows its API contract (`ResolveAI_Frontend_API_Contract.pdf`, v1.0) exactly: no extra endpoints, no fabricated data.

## Features

- **Demo profile selection**: profiles come from `GET /api/profiles`. Example prompts come from the contract's seeded scenarios. No signup.
- **Chat workspace**: multi-turn conversations, honest processing states (elapsed time only, since replies are not streamed), cold-start hints, and error recovery with retry.
- **Agent activity**: every real tool call the backend returns (tool, status, input/output summary, duration), shown inline under each reply and in an inspector panel. Each step expands for details.
- **Ticket confirmation**: when the response has a `pendingAction`, a card shows its summary. Confirm and Cancel send the contract's plain messages (`"Yes, please."` / `"No, thanks."`), and tickets are refetched afterwards.
- **Support tickets**: category, order, summary, evidence, status and creation date. Ticket IDs mentioned in a reply are shown as cards built from the real ticket records.
- **Conversation restoration**: the current conversation lives in the URL (`/chat?c=conv_…`) and is restored via `GET /api/conversations/:id`. Recent conversation IDs are remembered per profile in the browser, because the API has no endpoint to list them.

## Tech stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · TanStack Query · Lucide icons

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: defaults to the deployed demo backend
npm run dev
```

| Variable          | Default                               | Purpose                                         |
| ----------------- | ------------------------------------- | ----------------------------------------------- |
| `RESOLVE_API_URL` | `https://resolve-ai-ghzv.onrender.com` | ResolveAI backend base URL (server-side only). |

The demo backend runs on a free tier. The first request after it has been idle can take about a minute. The UI shows this state instead of failing.

## How it talks to the backend

```
Browser ──► Next.js route handlers (src/app/api/*) ──► ResolveAI backend
            • session token kept in an httpOnly cookie
            • Authorization: Bearer <token> attached server-side
            • on 401: new session for the same profile, retry once
            • errors passed through as { error: { code, message } } + Retry-After
```

- The browser never sees the session token or the backend URL (and there is no AI key in the frontend at all).
- `src/lib/server/resolveApi.ts` holds all of the proxy logic. Each route handler is a few lines long.
- `src/lib/apiClient.ts` is the browser's fetch wrapper. It throws a typed `ApiError` carrying `status`, `code` and `retryAfter`.
- `src/lib/errors.ts` maps every contract error code to friendly copy. Raw codes are never shown to users.

## Project structure

```
src/
├── app/                     # Routes only: landing, /chat, proxy route handlers
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── layout/              # Logo
│   └── providers.tsx        # TanStack Query + tooltips
├── features/
│   ├── session/             # Profiles, session start, backend health, landing UI
│   ├── chat/                # Chat state (useChat), messages, composer, activity, confirmation
│   └── tickets/             # Ticket list, cards, inline ticket references
├── hooks/                   # Generic hooks: useNow, useLocalStorage
└── lib/                     # apiClient, errors, formatting, server-side proxy
```

Each feature owns its `api/`, `hooks/`, `components/` and `types.ts`. The types mirror section 5 of the contract.

## Extending

- **New agent tools** (for example a RAG knowledge-base search): add an entry to `src/features/chat/activityMeta.ts`. Unknown tools already render by name.
- **New pending action types**: `ConfirmationCard` already falls back to a generic "Confirm this action?" for any type other than `CREATE_SUPPORT_TICKET`.
- **Streaming**: all chat state is in `useChat`. A streaming transport would replace the single `mutateAsync` call and append partial text and activities to the same message model, so the components don't change.

## Testing against the demo data

Run through the contract's acceptance test (section 10):

1. Pick **Alice** and send *"I returned my headphones but have not received my refund."* You should see 3–4 activities, the last one awaiting confirmation, and a confirmation card. The tickets list is still empty.
2. Click **Confirm ticket**. The reply contains a ticket ID, an inline ticket card appears, and the Tickets tab lists exactly one ticket.
3. Confirm again and there is still exactly one ticket.

Demo data is shared per profile and an open ticket blocks a duplicate, so ask the backend team to reset the data for a clean demo.

## Deployment

Deploys as a standard Next.js app (for example on Vercel). Set `RESOLVE_API_URL`. The chat route exports `maxDuration = 120`, so make sure your platform allows functions to run that long.

```bash
npm run build && npm start
```
