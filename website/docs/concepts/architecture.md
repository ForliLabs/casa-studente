---
sidebar_position: 1
title: Architecture
description: A bird's-eye view of how CasaStudente is wired together.
---

# Architecture

CasaStudente is a **Next.js 16 App Router** application with a layered backend: pages and Server Actions on top, an application layer of stores and repositories in the middle, and external services (Stripe, OpenAI, Resend, Vercel Blob) at the edges. Every external service has a graceful local fallback, so the whole platform runs on a laptop with zero credentials.

## High-level view

```mermaid
graph TB
    subgraph Client["Browser / PWA"]
        UI["React 19 UI<br/>Server + Client Components"]
        SW["Service Worker<br/>Offline support"]
    end

    subgraph Next["Next.js 16 App Router"]
        Pages["Pages & Layouts<br/>50+ routes"]
        API["REST API<br/>19 endpoints"]
        Actions["Server Actions<br/>29 modules"]
        MW["Edge Middleware<br/>CSP, auth, rate limit"]
    end

    subgraph Logic["Business Logic"]
        Stores["In-memory stores<br/>25 domain modules"]
        Repos["Prisma repositories<br/>10 modules"]
        Services["Service layer<br/>7 integrations"]
    end

    subgraph External["External Services (optional)"]
        Stripe["Stripe Connect"]
        OpenAI["OpenAI GPT-4o-mini"]
        Resend["Resend (email)"]
        VBlob["Vercel Blob"]
        Sentry["Sentry"]
        PostHog["PostHog"]
    end

    UI --> Pages
    UI --> Actions
    UI -. fetch .-> API
    Pages --> Actions
    Actions --> Stores
    Actions --> Repos
    Repos --> Services
    Services --> Stripe
    Services --> OpenAI
    Services --> Resend
    Services --> VBlob
    MW -.-> Pages
    Pages -.-> Sentry
    UI -.-> PostHog
```

## Application layers

| Layer | Lives in | Responsibility |
| ----- | -------- | -------------- |
| **UI** | `src/app/**`, `src/components/**` | React Server Components for data fetching, Client Components for interactivity. |
| **Edge middleware** | `src/middleware.ts` | Security headers (CSP, HSTS), route protection, locale negotiation, rate limiting. |
| **Server Actions** | `src/lib/actions/**` (29 modules) | The primary mutation API. Called from forms and `useActionState`. |
| **REST API** | `src/app/api/**` (19 endpoints) | Public reads, webhooks, file upload, institutional data, third-party callbacks. |
| **Stores & Repositories** | `src/lib/stores/**`, `src/lib/repositories/**` | Stores wrap a typed in-memory CRUD base class. Repositories wrap Prisma. Both expose the same shape, so business logic doesn't know which is active. |
| **Service layer** | `src/lib/services/**` | Adapters for Stripe, OpenAI, Resend, Vercel Blob, Sentry, PostHog. Every adapter detects missing credentials and returns a no-op or fixture. |

## Data access strategy

The platform deliberately supports two coexisting storage backends:

```mermaid
flowchart LR
    A["Server Action / API"] --> B{"DATABASE_URL set?"}
    B -- "Yes" --> R["Prisma repository<br/>(PostgreSQL)"]
    B -- "No" --> S["InMemoryStore<br/>(seeded fixtures)"]
    R --> X["Same return shape"]
    S --> X
```

- **Seeded in-memory stores** make first-run, demos and tests instantaneous.
- **Prisma + Postgres** kicks in when `DATABASE_URL` is set, with no code changes.
- Both implementations conform to the same TypeScript interfaces (`src/lib/db.ts` defines the `InMemoryStore` base).

This is the same pattern used by the test suite (`tests/unit/stores.test.ts`) to exercise every domain module without spinning up a database.

## Request lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant N as Next.js (RSC)
    participant M as Middleware
    participant A as Server Action
    participant V as Zod validator
    participant L as Store / Repository
    participant S as External service

    U->>M: HTTP request
    M->>M: CSP, auth cookie, rate limit
    M->>N: Forward
    N->>A: Invoke Server Action (form post)
    A->>V: Validate input
    V-->>A: Typed payload
    A->>L: Read / write
    L->>S: Call Stripe / Resend / OpenAI (if needed)
    S-->>L: Response (or fixture)
    L-->>A: Result
    A-->>N: Revalidate path / return
    N-->>U: Streaming HTML
```

## Security architecture

- **Auth**: cookie-based sessions (`HttpOnly`, `Secure`, `SameSite=Lax`) backed by bcrypt (cost 12) password hashing. Legacy password migration is built in (`src/lib/password.ts`).
- **CSRF**: per-session double-submit tokens validated on every Server Action.
- **Rate limiting**: in-memory token bucket (`src/lib/rate-limit.ts`) with per-route windows.
- **Validation**: every input goes through Zod schemas in `src/lib/validation.ts`.
- **CSP & headers**: applied at the edge in `middleware.ts`.
- **Role-based access**: `student | landlord | admin` enforced in actions and layouts.
- **University verification**: optional document upload, manual approval, plus email-domain heuristics (`@studio.unibo.it`).

## Where to go next

- 🗃️ **[Data Model](./data-model)** — the 24-model Prisma schema, visualized.
- 🔐 **[Auth & Trust](./auth-and-trust)** — how identity, verification and trust scores work.
- 🔎 **[Listings & Search](./listings-and-search)** — how discovery is built.
- 💬 **[Messaging](./messaging)** — conversation threads and translation.
- 💳 **[Payments](./payments)** — Stripe Connect end-to-end.
