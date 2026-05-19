---
sidebar_position: 1
title: REST API
description: All public HTTP endpoints exposed by CasaStudente.
---

# REST API

All endpoints are served from the Next.js App Router under `/api/`. Requests and responses are JSON unless noted. Errors follow the convention in [Errors](./errors).

Base URL (production): `https://casastudente.it`

## Health

### `GET /api/health`

Reports platform availability. Excluded from middleware. Wire to your uptime monitor.

**Response 200:**

```json
{
  "status": "ok",
  "timestamp": "2026-07-01T12:00:00.000Z",
  "services": {
    "stripe": true,
    "email": false,
    "blob": false,
    "ai": true,
    "monitoring": { "sentry": false, "posthog": false, "environment": "production" }
  }
}
```

## Listings

### `GET /api/listings`

Public catalogue. Supports filter query parameters.

| Param | Type | Example |
| ----- | ---- | ------- |
| `zone` | string | `Campus` |
| `type` | string | `stanza singola` |
| `priceMin` | number | `200` |
| `priceMax` | number | `500` |
| `verified` | `0` \| `1` | `1` |
| `sort` | `newest` \| `price-asc` \| `price-desc` | `price-asc` |
| `limit` | number (default 50, max 100) | `20` |
| `offset` | number | `0` |

**Response 200:**

```json
[
  {
    "id": "via-colombo-21-singola",
    "title": "Stanza singola luminosa vicino al Campus",
    "address": "Via Cristoforo Colombo 21, Forlì",
    "zone": "Campus",
    "type": "stanza singola",
    "price": 360,
    "deposit": 720,
    "status": "Disponibile",
    "verified": true,
    "photos": ["https://blob.../1.jpg"],
    "features": ["Wi-Fi fibra", "Scrivania ampia"],
    "landlord": { "id": "user_elena", "name": "Elena Rossi", "trust": "gold" }
  }
]
```

### `GET /api/listings/[id]`

**Response 200:** a single `Listing` object.

**Response 404:**

```json
{ "error": "Listing not found" }
```

## Authentication

### `POST /api/auth/logout`

Invalidates the current session cookie. Idempotent.

**Auth:** any session.

**Response 200:**

```json
{ "ok": true }
```

Authentication itself (login, register, verify, password reset) is implemented as **Server Actions**, not REST endpoints. See [Server Actions → Authentication](./server-actions#authentication-actions).

## File upload

### `POST /api/upload`

Multipart upload to Vercel Blob.

**Auth:** session required, role permits upload (e.g. landlords for listing photos, any user for documents).

**Request:** `multipart/form-data` with `file` field plus a `kind` field (`listing-photo`, `document`, `evidence`).

**Response 200:**

```json
{
  "url": "https://blob.vercel-storage.com/listings/abc.jpg",
  "size": 124512,
  "contentType": "image/jpeg"
}
```

When `BLOB_READ_WRITE_TOKEN` is unset, the endpoint returns a deterministic mock URL of the form `https://mock-blob/.../filename`.

## Landlord APIs

All endpoints under `/api/landlord/**` require `role === 'landlord'`.

| Endpoint | Method | Purpose |
| -------- | ------ | ------- |
| `/api/landlord/analytics` | GET | Views, inquiries, conversion, average response time. |
| `/api/landlord/inquiries` | GET | Open conversations sorted by recency. |

## Institutional data APIs

Open, unauthenticated, aggregate-only. Useful for journalists, researchers, civic teams.

### `GET /api/institutional/average-rents`

```json
{
  "zone": "Campus",
  "month": "2026-06",
  "average": 412,
  "median": 400,
  "samples": 87
}
```

### `GET /api/institutional/vacancy-rates`

```json
{
  "month": "2026-06",
  "zones": [
    { "zone": "Campus", "vacancy": 0.08 },
    { "zone": "Centro", "vacancy": 0.14 }
  ]
}
```

### `GET /api/institutional/demand-forecast`

```json
{
  "horizon": "2026-09",
  "expectedInquiries": 1240,
  "confidence": 0.7
}
```

### `GET /api/institutional/student-satisfaction`

```json
{
  "month": "2026-06",
  "npsStudents": 47,
  "npsLandlords": 38
}
```

These four endpoints are deliberately public and rate-limited per-IP.

## Stripe webhooks

### `POST /api/webhooks/stripe`

Receives Stripe events. Signature is verified using `STRIPE_WEBHOOK_SECRET`.

See [API → Webhooks](./webhooks) for the full handler contract.

## Moonshot APIs

Experimental endpoints behind feature flags. They live under `/api/moonshots/**` and require an authenticated session. Schemas may change; treat as unstable.

Examples:

- `GET /api/moonshots/guaranteed-rent/quote`
- `GET /api/moonshots/digital-twin/[listingId]`
- `POST /api/moonshots/concierge/checkin`

## Locale

### `GET /api/locale`
### `POST /api/locale`

Read or change the user's preferred locale. POST body: `{ "locale": "it" | "en" | "es" | "fr" }`.
