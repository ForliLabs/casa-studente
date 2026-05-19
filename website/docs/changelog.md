---
title: Changelog
description: Notable changes to CasaStudente.
---

# Changelog

The authoritative changelog lives in [`CHANGELOG.md`](https://github.com/ForliLabs/casa-studente/blob/main/CHANGELOG.md) at the repo root. This page mirrors it. Releases follow **[Semantic Versioning](https://semver.org/)**.

## Versioning strategy

- **MAJOR** — breaking changes to the public API (REST routes, Server Action signatures, environment variables).
- **MINOR** — new features that don't break existing flows.
- **PATCH** — bug fixes, dependency bumps, documentation.

The Prisma schema is treated as part of the public surface: any migration that requires manual operator intervention is a MAJOR bump.

## 0.1.0 — Public preview

- 24 Prisma models covering users, listings, conversations, payments, leases, reviews, disputes, telemetry.
- 29 Server Action modules, 19 REST endpoints, 25 in-memory stores for zero-config dev.
- Stripe Connect Express marketplace with mock mode.
- AI search, description generation and message translation with deterministic fallbacks.
- Trust tiers (bronze/silver/gold), 5-dimension bidirectional reviews.
- Roommate compatibility algorithm with deal-breakers.
- Italian-law lease contracts (`transitorio`, `4+4`, `3+2`) with cedolare-secca tax exports.
- Multilingual UI in Italian, English, Spanish, French.
- Admin operations console: moderation, telemetry, analytics, disputes.
- PWA with offline support; Sentry + PostHog hooks.
- 137 unit tests, full Playwright E2E coverage.

## Follow releases

- ⭐ Star the [GitHub repo](https://github.com/ForliLabs/casa-studente).
- 🛎️ Watch → Custom → Releases for an email on every cut.
- 📰 Subscribe to this site’s [RSS feed](/blog/rss.xml) for changelog posts.
