---
title: Troubleshooting
description: Fixes for the most common issues running CasaStudente.
---

# Troubleshooting

If something’s broken locally, scan this page first.

## Install & boot

### `prisma generate` fails on Node < 18

Use Node 18 LTS or newer:

```bash
nvm install 20
nvm use 20
npm run db:generate
```

### Port 3000 is already in use

```bash
PORT=3001 npm run dev
```

### "Module not found: '@/generated/prisma'"

You forgot the post-install step:

```bash
npm run db:generate
```

This emits the typed client. Re-run any time `prisma/schema.prisma` changes.

## Database

### Prisma can't reach Postgres

Verify the connection string:

```bash
node -e "console.log(new URL(process.env.DATABASE_URL).host)"
```

If you're using Neon or Supabase, the URL must end with `?sslmode=require`.

### Schema and database drift

If `npm run db:push` complains about drift, you have a real migration to author:

```bash
npm run db:migrate -- --name describe_change
```

For local-only experimentation, you can blow the DB away:

```bash
npx prisma migrate reset --force
```

## Payments

### "Stripe webhook signature verification failed"

You forgot `STRIPE_WEBHOOK_SECRET`. Run the CLI in another terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_*` value it prints into `.env`, then restart `npm run dev`.

### Test card always declines

Use Stripe's official test number: `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP. Country must match the country of your Stripe account.

### Landlord can't connect Stripe

In **test mode**, you must complete Stripe's mock KYC form (it’s pre-filled). In **live mode**, the landlord needs a real Italian IBAN and an ID document. Check `/api/health` for `stripe: true` first.

## AI

### Natural-language search returns nonsense

You're probably in fallback mode. Verify:

```bash
curl http://localhost:3000/api/health | grep ai
# "ai": true
```

If `false`, set `OPENAI_API_KEY` in `.env` and restart.

### Translations don't appear

Translations only run when sender and receiver have different `locale`. To test, set the demo accounts to different locales:

```ts
await prisma.user.update({ where: { email: 'martina.lopez@studio.unibo.it' }, data: { locale: 'es' }});
```

## Email

### No verification email arrives

In dev, emails are printed to the server console — check the terminal running `npm run dev`. To send real emails, set `RESEND_API_KEY` and a verified `EMAIL_FROM` domain in Resend.

### Resend says "domain not verified"

Add the DNS records Resend gives you (DKIM and SPF). Until that’s done, you can only send to your own Resend account email.

## Auth

### "Session expired" loop after login

Most often: cookie `Secure` flag and `http://` mismatch. In dev, sessions are set `Secure=false`. If you proxy via HTTPS, ensure `NEXT_PUBLIC_APP_URL` is HTTPS too, or visit the app over HTTP directly.

### CSRF token mismatch

Happens when you reuse a form across sessions. Refresh the page to mint a new token.

## Build & deploy

### `next build` runs out of memory on Vercel

The `tsconfig.tsbuildinfo` cache can balloon. Add to `.gitignore` and clear locally:

```bash
rm -f tsconfig.tsbuildinfo
```

### Production page crashes with "PrismaClientInitializationError"

`DATABASE_URL` is missing in the Vercel project's environment. Add it and redeploy.

## Tests

### Vitest hangs on first run

Vitest spins up workers in parallel; on CPU-constrained machines, reduce concurrency:

```bash
npm test -- --threads false
```

### Playwright tests can't reach dev server

`test:e2e` does not start the dev server for you. Run `npm run dev` in another terminal first.

## Still stuck?

- 🐛 [Open an issue](https://github.com/ForliLabs/casa-studente/issues/new) — please include the `x-request-id` header from the failing response.
- 💬 [Start a discussion](https://github.com/ForliLabs/casa-studente/discussions).
- 🔎 Search the [FAQ](./faq).
