---
sidebar_position: 1
title: Environment Variables
description: Every environment variable, what it does, and what happens when it's empty.
---

# Environment Variables

All variables are defined in [`.env.example`](https://github.com/ForliLabs/casa-studente/blob/main/.env.example). Every external service is **optional** — the platform provides a graceful fallback for each.

## Core

| Variable | Required | Default | Purpose |
| -------- | -------- | ------- | ------- |
| `NEXT_PUBLIC_APP_URL` | yes (prod) | `http://localhost:3000` | Used for absolute URLs in emails and OG tags. |
| `NEXTAUTH_SECRET` | yes (prod) | — | Signs session payloads. **Rotate before going live.** |
| `CSRF_SECRET` | yes (prod) | — | Signs CSRF tokens. **Rotate before going live.** |

## Database

| Variable | Required | Fallback |
| -------- | -------- | -------- |
| `DATABASE_URL` | no | InMemoryStore with seeded fixtures. Data resets on restart. |

## Stripe

| Variable | Required | Fallback |
| -------- | -------- | -------- |
| `STRIPE_SECRET_KEY` | no | Mock mode: deterministic checkout URLs, synthetic webhooks. |
| `STRIPE_PUBLISHABLE_KEY` | no | Mock mode. |
| `STRIPE_WEBHOOK_SECRET` | yes (real Stripe) | n/a |
| `STRIPE_PLATFORM_FEE_PERCENT` | no | `5` |

See [Stripe Payments](../guides/stripe-payments) for the full setup.

## Email (Resend)

| Variable | Required | Fallback |
| -------- | -------- | -------- |
| `RESEND_API_KEY` | no | Logs the email body to the server console. |
| `EMAIL_FROM` | no | `noreply@casastudente.it` |

## File storage (Vercel Blob)

| Variable | Required | Fallback |
| -------- | -------- | -------- |
| `BLOB_READ_WRITE_TOKEN` | no | Returns deterministic mock URLs. Uploaded files are not persisted. |

## AI (OpenAI)

| Variable | Required | Fallback |
| -------- | -------- | -------- |
| `OPENAI_API_KEY` | no | Template-based NL search, default description, message untranslated. |
| `OPENAI_MONTHLY_BUDGET_USD` | no | unlimited |

## Monitoring

| Variable | Required | Fallback |
| -------- | -------- | -------- |
| `SENTRY_DSN` | no | Errors logged to console only. |
| `NEXT_PUBLIC_SENTRY_DSN` | no | Browser errors logged to console only. |
| `POSTHOG_API_KEY` | no | Analytics events logged to console only. |
| `NEXT_PUBLIC_POSTHOG_KEY` | no | Same as above. |

## OAuth (optional)

| Variable | Required | Fallback |
| -------- | -------- | -------- |
| `GOOGLE_CLIENT_ID` | no | Email/password only. |
| `GOOGLE_CLIENT_SECRET` | no | Email/password only. |

## Generating secrets

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice for `NEXTAUTH_SECRET` and `CSRF_SECRET`.

## Validating your environment

```bash
curl http://localhost:3000/api/health
```

The `services` block tells you which integrations are actually configured.
