# 📡 CasaStudente API Reference

> All endpoints are served from the Next.js App Router under `/api/`.  
> Server Actions are invoked via form submissions or `useActionState` hooks.

---

## Table of Contents

- [REST API Endpoints](#rest-api-endpoints)
  - [Health](#health)
  - [Listings](#listings)
  - [Authentication](#authentication)
  - [File Upload](#file-upload)
  - [Landlord APIs](#landlord-apis)
  - [Institutional Data APIs](#institutional-data-apis)
  - [Stripe Webhooks](#stripe-webhooks)
  - [Moonshot APIs](#moonshot-apis)
- [Server Actions](#server-actions)
  - [Authentication Actions](#authentication-actions)
  - [Listing Actions](#listing-actions)
  - [Messaging Actions](#messaging-actions)
  - [Payment Actions](#payment-actions)
  - [Review Actions](#review-actions)
  - [Notification Actions](#notification-actions)
  - [AI Actions](#ai-actions)
  - [Onboarding Actions](#onboarding-actions)
  - [Additional Action Modules](#additional-action-modules)
- [Authentication & Authorization](#authentication--authorization)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)

---

## REST API Endpoints

### Health

#### `GET /api/health`

Health check endpoint. Excluded from middleware matching.

**Auth:** None  
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-01T12:00:00.000Z",
  "services": {
    "stripe": true,
    "email": false,
    "blob": false,
    "ai": true,
    "monitoring": { "sentry": false, "posthog": false, "environment": "development" }
  }
}
```

---

### Listings

#### `GET /api/listings`

Retrieve all available listings.

**Auth:** None  
**Response:** `Listing[]`
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
    "photos": ["..."],
    "features": ["Wi‑Fi fibra", "Scrivania ampia"],
    "landlord": { "name": "Elena Rossi", "responseRate": "98%" }
  }
]
```

#### `GET /api/listings/[id]`

Retrieve a single listing by ID.

**Auth:** None  
**Params:** `id` (path) — Listing ID string  
**Response:** `Listing` or `404`
```json
{ "error": "Listing not found" }
```

---

### Authentication

#### `POST /api/auth/logout`

Destroy the current session and clear cookies.

**Auth:** Session cookie (if present)  
**Response:** Redirect to `/`

---

### File Upload

#### `POST /api/upload`

Upload a file to Vercel Blob storage.

**Auth:** Required — session cookie (`401` if missing)  
**Content-Type:** `multipart/form-data`  
**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | `File` | ✅ | The file to upload |
| `category` | `string` | ✅ | One of: `listing_photo`, `document`, `evidence`, `profile` |
| `listingId` | `string` | ❌ | Associated listing ID |

**Size Limits:**

| Category | Max Size |
|---|---|
| `listing_photo` | 10 MB |
| `document` | 25 MB |
| `evidence` | 25 MB |
| `profile` | 5 MB |

**Allowed MIME Types:**

| Category | Types |
|---|---|
| `listing_photo` | `image/jpeg`, `image/png`, `image/webp`, `image/avif` |
| `document` | `application/pdf`, `application/msword`, DOCX |
| `evidence` | `image/jpeg`, `image/png`, `image/webp`, `application/pdf` |
| `profile` | `image/jpeg`, `image/png`, `image/webp` |

**Response:**
```json
{
  "success": true,
  "url": "https://blob.vercel-storage.com/...",
  "fileKey": "listing_photo/user-1/1234567-photo.jpg"
}
```

---

### Landlord APIs

#### `GET /api/landlord/listings`

Retrieve the authenticated landlord's listings.

**Auth:** Session cookie  
**Response:** Landlord listing objects with inquiry counts.

#### `GET /api/landlord/inquiries`

Get inquiry threads for the landlord's listings.

**Auth:** Session cookie  
**Response:** Array of inquiry/message threads.

#### `GET /api/landlord/analytics`

Landlord dashboard analytics data.

**Auth:** Session cookie  
**Response:** Statistics (active listings, inquiries, response rate, trends).

---

### Institutional Data APIs

> These endpoints provide anonymized housing market data for university and municipal partners.

**Auth:** All require `Authorization: Bearer <API_KEY>` header. Returns `401` without it.

#### `GET /api/institutional/average-rents`

Average rental prices by zone and listing type.

**Query Params:** `zone` (optional), `type` (optional)

#### `GET /api/institutional/vacancy-rates`

Vacancy rates across Forlì zones.

#### `GET /api/institutional/demand-forecast`

Housing demand forecast for upcoming academic terms.

**Query Params:** `months` (optional, default: 6)

#### `GET /api/institutional/student-satisfaction`

Aggregated student satisfaction metrics.

---

### Stripe Webhooks

#### `POST /api/webhooks/stripe`

Handles Stripe webhook events for the payment lifecycle.

**Auth:** Stripe signature verification (`stripe-signature` header)  
**Events Handled:**
- `checkout.session.completed` — Payment successful
- `payment_intent.payment_failed` — Payment failed
- `invoice.paid` — Recurring subscription payment
- `account.updated` — Connected account status change

**Response:** `200 OK` with `{ received: true }` or `400` on verification failure.

---

### Moonshot APIs

> Experimental features under development.

| Endpoint | Method | Description |
|---|---|---|
| `GET /api/moonshots/guaranteed` | GET | Guaranteed rent program data |
| `GET /api/moonshots/pods` | GET | Co-living pod listings |
| `GET /api/moonshots/digital-twin` | GET | Digital twin apartment data |
| `GET /api/moonshots/passport` | GET/POST | Student housing passport (GET: retrieve, POST: create) |
| `GET /api/moonshots/resilience` | GET | Resilience fund status |
| `GET /api/moonshots/arrival` | GET | Arrival concierge packages |

---

## Server Actions

> Server Actions are the primary mutation API. They use `"use server"` and are called via `useActionState` or form submissions. All actions validate input with Zod schemas.

### Authentication Actions

**Module:** `src/lib/actions/auth.ts`

#### `loginAction(prevState, formData)`

Authenticate a user with email and password.

| Field | Type | Required |
|---|---|---|
| `email` | `string` | ✅ |
| `password` | `string` | ✅ |

**Rate Limited:** ✅ (5 attempts / 15 min per email)  
**Returns:** `{ error?: string }` — Redirects to `/dashboard` on success.

#### `registerAction(prevState, formData)`

Create a new user account.

| Field | Type | Required |
|---|---|---|
| `email` | `string` | ✅ |
| `name` | `string` | ✅ |
| `password` | `string` | ✅ (min 8 chars) |
| `confirmPassword` | `string` | ✅ |
| `role` | `"student" \| "landlord"` | ✅ |

**Returns:** `{ error?: string }` — Redirects to `/dashboard` on success.

#### `logoutAction()`

Destroy the session and redirect to `/`.

#### `verifyUniversityAction(prevState, formData)`

Submit university verification (student ID + document).

| Field | Type | Required |
|---|---|---|
| `universityId` | `string` | ✅ |
| `universityDocument` | `string` | ✅ |

---

### Listing Actions

**Module:** `src/lib/actions/listings.ts`

#### `createListingAction(prevState, formData)`

Create a new listing. Requires `landlord` or `admin` role.

**Validated with:** `createListingSchema` (Zod)

| Field | Type | Required |
|---|---|---|
| `title` | `string` | ✅ (3–200 chars) |
| `address` | `string` | ✅ (5–300 chars) |
| `type` | `ListingType` | ✅ |
| `price` | `number` | ✅ (1–10,000) |
| `deposit` | `number` | ❌ |
| `description` | `string` | ❌ (max 5,000 chars) |
| ... | | See `validation.ts` |

**XSS Protection:** All string fields are HTML-stripped via `stripHtml()`.

#### `updateListingAction(formData)`
#### `deleteListingAction(formData)`
#### `updateListingStatusAction(formData)`

CRUD operations — require auth + ownership or admin role.

---

### Messaging Actions

**Module:** `src/lib/actions/messages.ts`

#### `sendMessageAction(formData)`

Send a message in an existing conversation. **Validated with:** `sendMessageSchema`.

| Field | Type | Required |
|---|---|---|
| `conversationId` | `string` | ✅ |
| `content` | `string` | ✅ (1–5,000 chars, HTML stripped) |

#### `startConversationAction(formData)`

Create a new conversation thread for a listing. **Validated with:** `contactFormSchema`.

#### `markConversationReadAction(formData)`

Mark all messages in a conversation as read.

---

### Payment Actions

**Module:** `src/lib/actions/payments.ts`

#### `createPaymentAction(formData)`

Create a payment record. **Validated with:** `createPaymentSchema`.

| Field | Type | Required |
|---|---|---|
| `recipientId` | `string` | ✅ |
| `listingId` | `string` | ✅ |
| `amount` | `number` | ✅ (1–100,000) |
| `type` | `"rent" \| "deposit"` | ✅ |

**Platform Fee:** 5% (configurable via `STRIPE_PLATFORM_FEE_PERCENT`).

#### `createLeaseAction(formData)`

Create a digital lease contract. **Validated with:** `createLeaseSchema`.

| Field | Type | Required |
|---|---|---|
| `listingId` | `string` | ✅ |
| `address` | `string` | ✅ |
| `monthlyRent` | `number` | ✅ |
| `startDate` | `string` | ✅ |
| `endDate` | `string` | ✅ |
| `contractType` | `"transitorio" \| "4+4" \| "3+2"` | ❌ |
| `taxRegime` | `"cedolare_secca" \| "ordinario"` | ❌ |

---

### Review Actions

**Module:** `src/lib/actions/reviews.ts`

#### `submitReviewAction(formData)`

Submit a review for a landlord/tenant. **Validated with:** `createReviewSchema`.

| Field | Type | Required |
|---|---|---|
| `revieweeId` | `string` | ✅ |
| `listingId` | `string` | ✅ |
| `ratingOverall` | `1–5` | ✅ |
| `ratingCleanliness` | `1–5` | ✅ |
| `ratingCommunication` | `1–5` | ✅ |
| `ratingAccuracy` | `1–5` | ✅ |
| `ratingValue` | `1–5` | ✅ |
| `comment` | `string` | ✅ (10–2,000 chars) |

#### `flagReviewAction(formData)`

Flag a review for moderation.

---

### Notification Actions

**Module:** `src/lib/actions/notifications.ts`

#### `markNotificationReadAction(formData)`
Mark a single notification as read.

#### `markAllNotificationsReadAction()`
Mark all notifications for the current user as read.

#### `saveSearchAction(formData)`
Save a search with alert preferences. **Validated with:** `savedSearchSchema`.

#### `deleteSavedSearchAction(formData)`
Delete a saved search.

---

### AI Actions

**Module:** `src/lib/actions/ai.ts`

#### `generateListingDescription(formData)`

AI-powered listing description generator. **Validated with:** `aiGenerateSchema`.  
**Rate Limited:** ✅ (50/day per user)

| Field | Type | Required |
|---|---|---|
| `type` | `string` | ✅ |
| `zone` | `string` | ✅ |
| `size` | `string` | ❌ |
| `price` | `string` | ❌ |
| `features` | `string` | ❌ (comma-separated) |

**Returns:** `{ descriptionIt: string, descriptionEn: string }`

#### `naturalLanguageSearch(formData)`

Parse natural language into search filters. **Validated with:** `nlSearchSchema`.

| Field | Type | Required |
|---|---|---|
| `query` | `string` | ✅ (3–500 chars) |

**Returns:** `{ filters: SearchFilters, interpretation: string }`

#### `translateMessage(formData)`

Translate a message between supported languages.

#### `chatAction(formData)`

Chat with the AI housing assistant. **Rate Limited:** ✅ (50/day per user)

---

### Onboarding Actions

**Module:** `src/lib/actions/onboarding.ts`

#### `completeOnboardingAction(formData)`
Complete the user onboarding flow.

#### `skipOnboardingAction()`
Skip onboarding and go directly to the dashboard.

---

### Additional Action Modules

The following modules provide specialized server actions:

| Module | Key Actions |
|---|---|
| `admin.ts` | User banning, listing moderation, platform statistics |
| `analytics.ts` | Dashboard analytics data retrieval |
| `disputes.ts` | Dispute filing, mediation, resolution |
| `documents.ts` | Document vault CRUD, verification status |
| `forecasting.ts` | Market forecasting queries |
| `housing-groups.ts` | Group creation, invitations, member management |
| `insurance.ts` | Insurance policy quotes and management |
| `journey.ts` | Student journey state machine transitions |
| `landlord-api.ts` | Landlord-specific data access |
| `legal-compliance.ts` | Compliance checks and documentation |
| `marketplace.ts` | Marketplace browsing and filtering |
| `matching.ts` | Roommate matching with compatibility scoring |
| `moonshots.ts` | Experimental feature interactions |
| `notification-hub.ts` | Notification preference management |
| `pricing.ts` | Dynamic pricing analysis |
| `reputation.ts` | Trust score calculations and badge management |
| `telemetry.ts` | Event tracking dispatch |
| `tenant-score.ts` | Tenant reliability scoring |
| `tours.ts` | Tour booking (virtual & in-person) |
| `university-sso.ts` | University SSO integration |
| `accessibility.ts` | Accessibility preference management |

---

## Authentication & Authorization

### Session-Based Auth

```
Client → POST /login (email + password)
       ← Set-Cookie: session_id=<id>; HttpOnly; Secure; SameSite=Lax
       ← Set-Cookie: csrf_token=<token>; Secure; SameSite=Strict
```

- Sessions expire after **7 days**
- CSRF tokens use `crypto.randomBytes(32)` + timing-safe comparison
- Passwords hashed with **bcrypt** (cost factor 12)
- Legacy hash formats (`hash_*`, `pbkdf2$*`) supported for backward compatibility

### Role Hierarchy

| Role | Access |
|---|---|
| `student` | Browse listings, send messages, make payments, write reviews |
| `landlord` | All student actions + create/manage listings, receive payments |
| `admin` | Full access — user management, moderation, analytics |

### Middleware Protection

Routes under `/dashboard/*` and `/admin/*` require a valid `session_id` cookie. The Edge Middleware also sets comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.).

---

## Rate Limiting

In-memory sliding window rate limiter:

| Context | Limit | Window |
|---|---|---|
| `auth` | 5 requests | 15 minutes |
| `api` | 100 requests | 1 minute |
| `actions` | 30 requests | 1 minute |
| `aiGenerate` | 50 requests | 24 hours |

> ⚠️ In production, replace with a Redis-based solution (the in-memory store doesn't persist across serverless invocations).

---

## Error Handling

### API Routes

All API routes return standard JSON error responses:

```json
{
  "error": "Description of the error"
}
```

| Status | Meaning |
|---|---|
| `200` | Success |
| `400` | Validation error or bad request |
| `401` | Authentication required |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

### Server Actions

Server Actions return result objects (never throw to the client):

```typescript
// Success
{ success: true, data: { ... } }

// Error
{ error: "Validation or business logic error message" }
```

Validation errors from Zod schemas include field-level messages in Italian.
