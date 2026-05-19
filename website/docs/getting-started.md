---
sidebar_position: 2
title: Getting Started
description: Clone, install, and run CasaStudente locally in under five minutes.
---

# Getting Started

You’ll have a fully functional CasaStudente instance running on `http://localhost:3000` in about **five minutes**. Every external service (Postgres, Stripe, OpenAI, Resend, Sentry, PostHog, Vercel Blob) is **optional**: the app falls back to in-memory stores, mock payments and console logging, so you can explore the entire feature set with zero credentials.

## Prerequisites

| Tool | Version | Notes |
| ---- | ------- | ----- |
| **Node.js** | ≥ 18 | LTS recommended (20 or 22). |
| **npm** | ≥ 9 | Comes with Node. |
| **PostgreSQL** | _(optional)_ | Only needed when you want to persist data beyond a restart. |
| **Git** | any | To clone the repo. |

Check your toolchain:

```bash
node --version   # → v20.x or v22.x
npm --version    # → 10.x+
```

## 1. Clone and install

```bash
git clone https://github.com/ForliLabs/casa-studente.git
cd casa-studente
npm install
```

`npm install` pulls Next.js 16, React 19, Prisma 7, Stripe, OpenAI and the rest. First-time installs typically take ~60 seconds on a fast connection.

## 2. Configure environment

Copy the example file:

```bash
cp .env.example .env
```

The defaults in `.env` are enough for local development. The most important secret to change before deploying is:

```bash
NEXTAUTH_SECRET="generate-a-strong-random-value"
CSRF_SECRET="another-strong-random-value"
```

You can generate strong secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Full environment reference: **[Configuration → Environment Variables](./config/environment)**.

## 3. Generate the Prisma client

```bash
npm run db:generate
```

This emits the typed Prisma client into `src/generated/prisma`. You only need this once after install (and after any schema change).

## 4. Start the dev server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**. You’ll see the homepage with seeded listings.

## 5. Log in with a demo account

The app seeds demo users on first run (in-memory mode):

| Role | Email | Password |
| ---- | ----- | -------- |
| Student | `martina.lopez@studio.unibo.it` | `password123` |
| Student | `luca.bianchi@studio.unibo.it` | `password123` |
| Landlord | `elena.rossi@casastudente.it` | `password123` |
| Admin | `admin@casastudente.it` | `admin123` |

:::tip
The student accounts already have completed roommate profiles and saved searches, so you can exercise matching and notifications immediately.
:::

## What to try first

Once you’re logged in, try one of these journeys:

- **As a student** — browse `/listings`, save a search, message a landlord, and walk through Stripe checkout in [mock mode](./guides/stripe-payments#mock-mode).
- **As a landlord** — head to `/dashboard/landlord`, publish a listing, see analytics and inquiries.
- **As an admin** — open `/admin/telemetry` and `/admin/moderation` to see operational tooling.

## Optional: connect a real Postgres

If you want listings, users and payments to survive a restart, point `DATABASE_URL` at a real Postgres and apply the schema:

```bash
# In .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/casastudente?schema=public"

# Then
npm run db:push     # apply schema without creating a migration
npm run db:seed     # seed demo data
npm run db:studio   # browse via Prisma Studio
```

For production migrations use `npm run db:migrate` instead of `db:push`. See **[Configuration → Scripts](./config/scripts)** for the full list.

## Next steps

- 📐 **[Architecture](./concepts/architecture)** — understand how the pieces fit together.
- 🛒 **[Stripe Payments](./guides/stripe-payments)** — wire up real or test Stripe keys.
- 🧠 **[AI Features](./guides/ai-features)** — plug in OpenAI for natural-language search.
- 🚀 **[Deploying to Vercel](./guides/deploying-to-vercel)** — go live in production.
