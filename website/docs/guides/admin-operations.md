---
sidebar_position: 7
title: Admin Operations
description: Moderation, telemetry, analytics, and dispute resolution.
---

# Admin Operations

The `admin` role unlocks `/admin/**`, a small but complete operations console. This page is for the human(s) running CasaStudente day-to-day.

## Dashboard sections

| Route | Purpose |
| ----- | ------- |
| `/admin` | Overview: signups, listings, payments, open disputes. |
| `/admin/users` | User search, role changes, bans, verification queue. |
| `/admin/moderation` | Listing approvals, flagged content, reported messages. |
| `/admin/marketplace` | Platform-wide payment volume, fee revenue, refunds. |
| `/admin/analytics` | Funnel: search → message → lease → renewal. |
| `/admin/telemetry` | Raw event stream from `TelemetryEvent`. |

## Verifying landlords and listings

Every new landlord and every new listing enters the moderation queue. Best practices:

1. **Cross-check IDs**: the uploaded document name on the User must match the legal name on the Stripe Connect account.
2. **Sample-call landlords** before approving their first listing. A 60-second phone call kills 90% of bad actors.
3. **Reverse-image-search photos** on the first 3 listings of a new landlord. Scammers reuse photos from international portals.

The queue UI provides one-click approve, reject (with reason), and "request more info" (which messages the user via a templated thread).

## Handling disputes

Disputes follow a 3-step pipeline:

```mermaid
flowchart LR
    A[Filed] --> B[Evidence gathered<br/>(72h)]
    B --> C[Admin review]
    C -->|Refund| D[Stripe refund + lease note]
    C -->|Deny| E[Lease unchanged + note]
    C -->|Mediated| F[Custom outcome]
```

- Both parties have 72 hours to upload evidence (chat exports, photos, receipts).
- Admin reviewer must record a written rationale; this becomes part of the dispute audit log.
- Refunds always go through `src/lib/actions/payments.ts`, never directly via the Stripe dashboard, so local state stays in sync.

## Telemetry

`TelemetryEvent` records every domain event with `(userId, type, payload, createdAt)`. The viewer at `/admin/telemetry` supports:

- Live tail (Server-Sent Events).
- Filter by event type, user, or date range.
- CSV export for ad-hoc analysis.

Common queries:

```sql
-- Top error types in the last 24h
SELECT type, COUNT(*) FROM "TelemetryEvent"
WHERE "createdAt" > now() - interval '24 hours'
  AND type LIKE 'error.%'
GROUP BY type ORDER BY 2 DESC;

-- Conversion: searched → messaged → leased
SELECT
  COUNT(*) FILTER (WHERE type = 'search.executed') AS searched,
  COUNT(*) FILTER (WHERE type = 'message.sent') AS messaged,
  COUNT(*) FILTER (WHERE type = 'lease.activated') AS leased
FROM "TelemetryEvent";
```

## Banning users

`/admin/users/[id]` has a ban control. Banning a user:

1. Invalidates all sessions.
2. Hides their listings (if landlord).
3. Notifies open conversation counterparties.
4. Refunds any in-progress checkout.
5. Records the reason on `User.banReason` for appeal review.

Bans are reversible by another admin within 30 days; after that, account data is anonymised.

## Health and uptime

- `GET /api/health` reports service availability (Stripe, Resend, Vercel Blob, OpenAI, Sentry, PostHog) and is excluded from middleware. Wire it to your uptime monitor.
- Sentry captures unhandled exceptions; PostHog records product analytics. Both are optional.
