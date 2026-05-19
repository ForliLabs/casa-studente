---
sidebar_position: 8
title: Deploying to Vercel
description: Production deployment in under twenty minutes.
---

# Deploying to Vercel

CasaStudente is built for Vercel. The repo already includes `vercel.json`, optimised Next.js 16 config and a `next build` that compiles cleanly in the Vercel build environment.

## 1. Prepare your accounts

You'll need accounts on:

- **Vercel** — hosting.
- **Neon** / **Supabase** / **Railway** — Postgres database.
- **Stripe** — payments (Connect enabled).
- **Resend** — transactional email.
- **Vercel Blob** — file storage (enable in your Vercel project).
- **OpenAI**, **Sentry**, **PostHog** — _all optional_.

## 2. Import the repo

In the Vercel dashboard:

1. **Add New → Project**.
2. Pick the `casa-studente` repository.
3. Framework Preset: **Next.js** (auto-detected).
4. Build Command: `npm run build`.
5. Output Directory: `.next` (default).

## 3. Configure environment variables

In the Vercel project settings → Environment Variables, paste this block (filling values appropriately):

```bash
DATABASE_URL="postgresql://...?sslmode=require"

STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PLATFORM_FEE_PERCENT="5"

RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@casastudente.it"

BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

NEXTAUTH_SECRET="<random 32 bytes>"
CSRF_SECRET="<random 32 bytes>"

OPENAI_API_KEY="sk-..."
SENTRY_DSN="https://...@sentry.io/..."
POSTHOG_API_KEY="phc_..."

NEXT_PUBLIC_APP_URL="https://casastudente.it"
```

Generate strong secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Full reference: [Configuration → Environment Variables](../config/environment).

## 4. Run migrations

From your laptop (one time, against the production database):

```bash
DATABASE_URL="postgresql://...?sslmode=require" npx prisma migrate deploy
```

To seed demo data into production (only do this on a fresh staging environment):

```bash
DATABASE_URL="..." npm run db:seed
```

## 5. Configure Stripe webhooks

In the Stripe dashboard → **Developers → Webhooks**:

- Endpoint: `https://casastudente.it/api/webhooks/stripe`
- Events to send: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`, `account.updated`.
- Copy the signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`.

## 6. Wire up your custom domain

Vercel → Project → Domains → Add `casastudente.it`. Follow the DNS instructions; TLS provisions automatically.

## 7. Smoke-test production

After the first deploy:

```bash
curl https://casastudente.it/api/health
# {"status":"ok","services":{"stripe":true,"email":true,"blob":true,...}}
```

Manual checklist:

- [ ] Register a landlord, upload an ID, see it pending verification.
- [ ] Approve via `/admin/moderation`.
- [ ] Create a listing.
- [ ] Register a student, message the landlord, see translation work.
- [ ] Walk through Stripe Checkout with a real card.
- [ ] Confirm webhook delivery in Stripe dashboard.
- [ ] Confirm receipt email is delivered (check spam).

## Scaling notes

- Next.js 16 RSC means most pages stream from the edge. There's no significant per-request cost on Vercel until you hit serverless invocation limits.
- Postgres is the bottleneck long before Vercel is — go with Neon's Pro tier or Supabase from day one.
- Vercel Blob auto-scales; you pay per GB stored and bandwidth.
- Stripe is the only stateful external dep; keep webhook handlers idempotent (the code already is — every handler upserts on Stripe IDs).

## Rollback

Vercel keeps every deployment. To roll back, open the previous successful deploy and click **Promote to Production**. Database migrations are forward-only — keep them additive whenever possible, and write a separate `down` migration if you need true rollback.
