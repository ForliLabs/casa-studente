---
title: FAQ
description: Frequently asked questions about CasaStudente.
---

# FAQ

## Product

### Is CasaStudente only for Forlì?

It’s designed for Forlì first because that’s where the housing crisis is most acute and the inventory is small enough to dominate. The codebase is city-agnostic — zone enums and language packs are config, not hard-coded. Expansion to Cesena, Ravenna, Rimini and Bologna is planned, but each new city needs ground-game (verifying landlords, building partnerships), not just code.

### Who can list a property?

Anyone who can prove ownership (or authorised property management) of an Italian residential unit and complete Stripe Connect KYC. Listings stay invisible to students until a moderator verifies them.

### How does verification work in practice?

Three signals: email domain (auto-accepts `@studio.unibo.it`), document upload (reviewed by an admin within 24h), and — for landlords — Stripe Connect KYC. See [Concepts → Auth & Trust](./concepts/auth-and-trust).

### Is there a mobile app?

Not yet. The web app is a PWA with offline support and is fast on mobile. A native app is on the roadmap once we have ≥ 1,000 active monthly users.

### What languages does the platform speak?

Italian (default), English, Spanish, French. The translation infrastructure supports adding any locale supported by OpenAI; PRs for Portuguese and German are welcome.

## Payments

### What's the platform fee?

5% of the first month's rent (charged to the student) plus a configurable `STRIPE_PLATFORM_FEE_PERCENT` on each rent payment (charged to the landlord, default 5%). See [Stripe Payments](./guides/stripe-payments).

### Can I rent out without using Stripe?

No. We use Stripe Connect for KYC, SCA compliance and dispute protection. Cash deals lose all platform protections; we actively discourage them.

### Are deposits held in escrow?

Deposits are held on Stripe's platform balance until lease termination, at which point they’re released according to the dispute outcome (or in full if no dispute is opened). This is technically a transfer + delayed payout, not escrow in the legal sense, but functionally equivalent.

### What happens if a tenant stops paying?

The lease enters a 30-day grace + remediation period. If still unpaid, the landlord can open a dispute. Landlords on the **rent guarantee** add-on receive the missing rent from the platform during the dispute window.

## Legal

### Is the digital lease legally binding in Italy?

Yes for residential rentals, provided both parties consent and the contract is registered with the Agenzia delle Entrate. The platform generates registration-ready PDFs; landlords are responsible for filing.

### Does cedolare secca apply?

It’s supported for transitorio, 4+4 and 3+2 leases where the landlord opts in. We don’t file taxes for you — we produce an export that pastes into your commercialista's spreadsheet.

### What about GDPR?

The platform stores the minimum data needed to operate. Every user has a self-service data export (JSON) and account deletion via `/dashboard/privacy`. Personal data is never shared with the AI model.

## Tech

### Why Next.js 16 and not just an SPA?

We need SEO for listing detail pages, server-side data fetching for fast first paint on slow Italian mobile connections, and Server Actions for typed mutations without a separate API layer. Next.js 16 is the only framework that ships all three out of the box.

### Why InMemoryStore alongside Prisma?

It makes the first run instantaneous: clone, install, run. It also keeps the test suite blazing fast (137 unit tests under a second). The dual interface forced us to think about the shape of our data layer cleanly.

### Why open source?

Three reasons: (1) trust — students and landlords can audit the code that handles their money; (2) ecosystem — other student cities can fork; (3) recruiting — public, well-built code is the best résumé. License selection is in progress (likely AGPL-3.0; see [`LICENSE`](https://github.com/ForliLabs/casa-studente/blob/main/LICENSE)).

### Can I self-host?

Yes. The full deployment guide is in [Deploying to Vercel](./guides/deploying-to-vercel). You can substitute any Node host for Vercel — only Vercel Blob is Vercel-specific, and the storage adapter interface is small enough to swap.

## Community

### How can I help?

Read [Contributing](./contributing). Specifically: triage issues, document edge cases, translate the UI to your language, build neighborhood guides, or onboard a friendly landlord in your building.

### Is there a Discord or chat?

We use [GitHub Discussions](https://github.com/ForliLabs/casa-studente/discussions) for product talk. A Discord may come later — chat platforms have higher operational cost and we don’t want to fragment.
