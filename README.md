# Aurum

An AI-assisted personal finance app: track accounts and transactions, set a budget, scan receipts, follow investments and subscriptions, link your bank with Plaid and watch crypto wallet balances, all behind a signed-in dashboard.

Built with Next.js 15 (App Router), React 19, Prisma + PostgreSQL, Clerk, and Tailwind / shadcn-ui.

## Features

| Area | What it does |
| --- | --- |
| **Accounts & transactions** | Current / savings accounts with a default account, income and expense transactions, recurring transactions (daily to yearly), search, filter, sort, pagination and bulk delete. Balances stay in sync with every create, edit and delete. |
| **Dashboard** | Account cards, income vs. expense overview, recent transactions, budget progress and subscription summary. |
| **AI receipt scanning** | Upload a receipt photo in *Add Transaction*; Google Gemini extracts amount, date, merchant and category to pre-fill the form. Every scan is logged on the *Receipts* page. |
| **Budget** | One monthly budget with live progress, remaining amount and a per-category breakdown of this month's spending. An Inngest job checks every 6 hours and sends an email and/or push notification at 80% (respecting your notification settings). |
| **Reports** | Six-month income / expense / savings trend, this month's expense breakdown, rule-based insights, CSV export. A monthly AI-written report is emailed on the 1st. |
| **Investments** | Add holdings, update prices by hand (no market-data feed is connected), see gain/loss and allocation. |
| **Subscriptions** | Track recurring payments, monthly and yearly cost, upcoming renewals; pause, resume, cancel or delete. |
| **Bank feeds (Plaid)** | Link a bank with Plaid Link. Each bank account becomes a local account and transactions are imported with cursor-based sync, de-duplicated, and kept current by Plaid webhooks. Access tokens are encrypted at rest (AES-256-GCM). |
| **Crypto wallets** | Watch-only: save public Ethereum / Polygon / BNB Smart Chain addresses and see native-token balances. No private keys are ever accepted or stored. |
| **Profile** | XP, level and achievements computed from your real activity. |
| **Settings** | Email / push / budget-alert preferences (saved server-side and honoured by the background jobs) and light / dark / system theme. |
| **Push notifications** | Web push via a service worker (bell icon in the header). |

### Not included

Multi-language and multi-currency support, biometric (WebAuthn) login, DeFi / token swaps, and in-app payment methods are **not** implemented. `/api/billing` exposes Stripe Checkout sessions for a future plans page but has no UI yet.

## Tech stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, shadcn/ui (Radix), Recharts, React Hook Form + Zod
- **Backend:** Next.js server actions and REST route handlers, Prisma 6, PostgreSQL
- **Auth:** Clerk (users are mirrored into the database on first sign-in and via a Svix-verified webhook)
- **Background jobs:** Inngest (recurring transactions, budget alerts, monthly reports)
- **Integrations:** Google Gemini, Resend + React Email, Plaid, viem, web-push, Arcjet (optional), Stripe (API only)

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (local, Neon, Supabase, ...)
- A [Clerk](https://clerk.com) application
- Optional, per feature: Gemini, Resend, Plaid, Arcjet and Stripe keys (see `.env.example`)

### Setup

```bash
git clone https://github.com/singhalakhdeep1/aurum.git
cd aurum
npm install
cp .env.example .env     # then fill in the values
npx prisma migrate deploy
npm run dev
```

Open <http://localhost:3000>.

A feature whose keys are missing is simply unavailable (for example, bank linking returns "not configured"); the rest of the app still works. Only the database and Clerk variables are required.

### Background jobs (Inngest)

Recurring transactions, budget alerts and monthly reports run as Inngest functions served at `/api/inngest`. In development run the Inngest dev server alongside the app:

```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

In production, connect the app to Inngest Cloud and set `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY`.

### Webhooks

| Endpoint | Purpose | Verification |
| --- | --- | --- |
| `/api/webhooks/clerk` | Mirror user create / update / delete into the database | Svix signature (`CLERK_WEBHOOK_SECRET`) |
| `/api/webhooks/plaid` | Import new bank transactions as Plaid reports them | Plaid JWT + body hash |

Both must be publicly reachable over HTTPS; use a tunnel such as ngrok for local testing.

### Plaid sandbox

Set `PLAID_ENV=sandbox` and generate `BANK_TOKEN_KEY` (see `.env.example`). In Plaid Link choose any institution and sign in with `user_good` / `pass_good`.

### Docker

```bash
cp .env.example .env     # fill in the values
docker compose up --build
```

This starts the app on port 3000 with a PostgreSQL 16 container and applies migrations on start.

## Scripts

```bash
npm run dev          # development server (Turbopack)
npm run build        # production build
npm run start        # run the production build
npm run lint         # ESLint
npm run typecheck    # TypeScript, no emit
npm run email        # React Email preview server
```

## Project layout

```
app/                 Next.js routes
  (auth)/            sign-in / sign-up
  (main)/            signed-in pages (dashboard, account, transaction, budget, reports,
                     investments, subscriptions, receipt, bank, crypto, profile, settings)
  api/               REST handlers (accounts, transactions, budget, investments, subscriptions,
                     bank, crypto, reports, receipts, user, notifications, webhooks, inngest)
actions/             Server actions used by the dashboard / account / transaction pages
components/          shadcn/ui primitives and shared page components
shared/lib/          Plaid, crypto, notifications, validators, middleware, profile stats
features/            Notification bell and investment dashboard components
lib/                 Prisma client, Inngest functions, Arcjet, Clerk user sync
emails/              React Email templates
prisma/              Schema and migrations
public/              Static assets, PWA manifest and the push service worker
```

## REST API

All endpoints require a signed-in session and only ever return the caller's own data.

| Method | Path | Notes |
| --- | --- | --- |
| GET, POST | `/api/accounts` | paginated list / create |
| GET, PUT, DELETE | `/api/accounts/[id]` | |
| GET, POST | `/api/transactions` | filters: `accountId`, `type`, `category`, `startDate`, `endDate`, `page`, `pageSize` |
| GET, PUT, DELETE | `/api/transactions/[id]` | balance is adjusted automatically |
| POST | `/api/transactions/bulk-delete` | `{ transactionIds: [...] }` |
| GET, POST | `/api/budget` | GET returns budget, spend this month and category breakdown |
| GET, POST | `/api/investments` | |
| GET, PUT, DELETE | `/api/investments/[id]` | |
| GET, POST | `/api/subscriptions` | |
| GET, PUT, DELETE | `/api/subscriptions/[id]` | |
| POST | `/api/subscriptions/[id]/cancel` | |
| GET | `/api/reports` | six-month trend, category breakdown, insights |
| GET | `/api/receipts` | receipt scan history |
| GET, PUT | `/api/user/profile`, `/api/user/settings` | |
| POST | `/api/bank/link-token`, `/api/bank/exchange`, `/api/bank/sync` | Plaid Link flow and manual sync |
| GET, DELETE | `/api/bank/accounts`, `/api/bank/accounts/[id]` | |
| GET, POST, DELETE | `/api/crypto/wallet`, `/api/crypto/wallet/[id]` | watch-only |
| POST, DELETE | `/api/notifications/subscribe` | register / remove a push subscription |
| POST, GET, DELETE | `/api/billing` | Stripe Checkout session, current plan, cancel at period end |

## Security notes

- Every route handler and server action checks the Clerk session; data access is always scoped to the signed-in user.
- Plaid access tokens are encrypted with `BANK_TOKEN_KEY` before they reach the database.
- Webhooks reject unsigned requests; Arcjet bot protection (when enabled) exempts them so signed provider calls still arrive.
- The service worker handles push only and never caches pages or API responses.
- `/api/seed` (demo data) is disabled when `NODE_ENV=production`.

## License

Proprietary. All rights reserved.
