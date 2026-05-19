---
title: Security
description: How to report vulnerabilities, and how we keep CasaStudente safe.
---

# Security

## Reporting a vulnerability

**Please do not open public issues for security problems.** Email **security@casastudente.it** with:

- A description of the issue.
- Steps to reproduce.
- The affected version or commit.
- Optionally, a suggested fix.

We aim to acknowledge within 48 hours and patch critical issues within 7 days.

## Scope

In scope:

- The codebase in `https://github.com/ForliLabs/casa-studente`.
- The production instance at `https://casastudente.it`.
- Any subdomain reachable from the above.

Out of scope:

- Third-party services (Stripe, Resend, OpenAI, Vercel) — report directly to them.
- Denial-of-service attacks against production. Please don’t.
- Findings that require physical access, social engineering, or the user being already compromised.

## What we do

- **bcrypt** at cost 12 for password hashing, with automatic re-hash on login for legacy formats.
- **HttpOnly, Secure, SameSite=Lax** session cookies; rotated on privilege escalation.
- **CSRF** double-submit tokens on every Server Action.
- **Content Security Policy** with strict `script-src` and `frame-ancestors 'none'`.
- **Rate limiting** on auth, messaging, payments and AI endpoints.
- **Zod validation** on every input.
- **No secrets in source**. All credentials come from environment variables.
- **Stripe webhook signature verification** with `STRIPE_WEBHOOK_SECRET`.
- **Audit log** for admin actions (bans, refunds, lease overrides) in `TelemetryEvent`.

## What you should do (operators)

- Set strong, randomly generated `NEXTAUTH_SECRET` and `CSRF_SECRET` before going live.
- Rotate secrets on a regular cadence; immediately on suspicion of leak.
- Keep `DATABASE_URL` behind a private network (Neon/Supabase enforce this by default).
- Enable Sentry (`SENTRY_DSN`) to capture unexpected exceptions.
- Enable 2FA on Stripe, Vercel, Resend and OpenAI dashboards.
- Apply Postgres backups and test the restore path quarterly.

## Disclosure policy

We follow **coordinated disclosure**:

1. Researcher reports privately.
2. We acknowledge within 48 hours.
3. We patch and deploy.
4. We credit the researcher in the changelog (unless they prefer anonymity).
5. We publish a postmortem if the issue affected users.
