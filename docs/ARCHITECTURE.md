# 🏛 CasaStudente Architecture

> System architecture overview for the CasaStudente student housing platform.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Application Layers](#application-layers)
- [Data Model](#data-model)
- [Authentication Flow](#authentication-flow)
- [Payment Flow](#payment-flow)
- [AI Pipeline](#ai-pipeline)
- [Notification System](#notification-system)
- [Data Access Strategy](#data-access-strategy)
- [Security Architecture](#security-architecture)
- [External Integrations](#external-integrations)
- [Deployment Architecture](#deployment-architecture)

---

## High-Level Architecture

```mermaid
graph TB
    subgraph Client["Browser / PWA"]
        UI["React 19 UI<br/>(Server + Client Components)"]
        SW["Service Worker<br/>(Offline Support)"]
    end

    subgraph NextJS["Next.js 16 App Router"]
        Pages["Pages & Layouts<br/>(50+ routes)"]
        API["REST API<br/>(19 endpoints)"]
        Actions["Server Actions<br/>(29 modules)"]
        MW["Edge Middleware<br/>(Security + Auth)"]
    end

    subgraph Logic["Business Logic Layer"]
        Stores["In-Memory Stores<br/>(25 domain stores)"]
        Repos["Repositories<br/>(10 modules, Prisma)"]
        Services["Service Layer<br/>(7 integrations)"]
    end

    subgraph External["External Services"]
        Stripe["Stripe<br/>(Payments)"]
        OpenAI["OpenAI<br/>(GPT-4o-mini)"]
        Resend["Resend<br/>(Email)"]
        VBlob["Vercel Blob<br/>(File Storage)"]
        Sentry["Sentry<br/>(Errors)"]
        PostHog["PostHog<br/>(Analytics)"]
    end

    subgraph Data["Data Layer"]
        PG[("PostgreSQL<br/>(24 Prisma models)")]
        InMem[("InMemoryStore<br/>(Dev fallback)")]
    end

    UI --> Pages
    UI --> Actions
    SW --> API
    MW --> Pages
    MW --> API
    Pages --> Stores
    Pages --> Repos
    API --> Stores
    API --> Services
    Actions --> Stores
    Actions --> Services
    Actions --> Repos
    Repos --> PG
    Stores --> InMem
    Services --> Stripe
    Services --> OpenAI
    Services --> Resend
    Services --> VBlob
    Services --> Sentry
    Services --> PostHog
```

---

## Application Layers

The codebase follows a **layered architecture** with clear separation of concerns:

```mermaid
graph LR
    subgraph Presentation["Presentation Layer"]
        direction TB
        P1["Pages (App Router)"]
        P2["Components (22 React)"]
        P3["i18n (4 languages)"]
    end

    subgraph Business["Business Logic Layer"]
        direction TB
        B1["Server Actions (29)"]
        B2["Validation (Zod schemas)"]
        B3["Algorithms<br/>(matching, scoring)"]
    end

    subgraph Data["Data Access Layer"]
        direction TB
        D1["InMemoryStore<br/>(current)"]
        D2["Repositories<br/>(Prisma, ready)"]
    end

    subgraph Infra["Infrastructure Layer"]
        direction TB
        I1["Services (Stripe, AI, Email)"]
        I2["Monitoring (Sentry, PostHog)"]
        I3["Middleware (CSP, Auth)"]
    end

    Presentation --> Business
    Business --> Data
    Business --> Infra
```

### Layer Details

| Layer | Location | Responsibility |
|---|---|---|
| **Presentation** | `src/app/`, `src/components/` | Pages, layouts, UI components, i18n |
| **Business Logic** | `src/lib/actions/`, `src/lib/validation.ts` | Server Actions, input validation, business rules |
| **Data Access** | `src/lib/stores/`, `src/lib/repositories/` | Domain stores, Prisma repositories |
| **Infrastructure** | `src/lib/services/`, `src/middleware.ts` | External service integrations, security |

---

## Data Model

### Core Entity Relationships

```mermaid
erDiagram
    User ||--o{ Session : "has"
    User ||--o{ Listing : "owns (landlord)"
    User ||--o{ Message : "sends"
    User ||--o{ ConversationUser : "participates"
    User ||--o| RoommateProfile : "has"
    User ||--o{ Review : "writes"
    User ||--o{ Review : "receives"
    User ||--o{ Payment : "pays"
    User ||--o{ Payment : "receives"
    User ||--o{ LeaseContract : "tenant"
    User ||--o{ LeaseContract : "landlord"
    User ||--o{ Notification : "receives"
    User ||--o{ Document : "owns"
    User ||--o| JourneyState : "has"
    User ||--o| TenantScore : "has"
    User ||--o{ Dispute : "files"
    User ||--o{ HousingGroupMember : "joins"

    Listing ||--o{ Review : "about"
    Listing ||--o{ Payment : "for"
    Listing ||--o{ LeaseContract : "for"
    Listing ||--o{ Conversation : "about"
    Listing ||--o{ TourBooking : "for"
    Listing ||--o{ UploadedFile : "has"

    Conversation ||--o{ ConversationUser : "has"
    Conversation ||--o{ Message : "contains"

    HousingGroup ||--o{ HousingGroupMember : "has"

    User {
        string id PK
        string email UK
        string name
        UserRole role
        string passwordHash
        boolean verified
        string campusId
        boolean banned
        string stripeCustomerId
        string stripeAccountId
        string locale
    }

    Listing {
        string id PK
        string title
        string address
        string zone
        ListingType type
        float price
        float deposit
        ListingStatus status
        boolean verified
        string landlordId FK
    }

    Payment {
        string id PK
        string payerId FK
        string recipientId FK
        string listingId FK
        float amount
        float platformFee
        PaymentType type
        PaymentStatus status
        string stripePaymentId
    }

    LeaseContract {
        string id PK
        string tenantId FK
        string landlordId FK
        string listingId FK
        float monthlyRent
        ContractType contractType
        TaxRegime taxRegime
        LeaseStatus status
    }
```

### Models Summary (24 total)

| Domain | Models |
|---|---|
| **Auth** | `User`, `Session` |
| **Listings** | `Listing` |
| **Messaging** | `Conversation`, `ConversationUser`, `Message` |
| **Roommates** | `RoommateProfile` |
| **Reviews** | `Review` |
| **Payments** | `Payment`, `LeaseContract` |
| **Notifications** | `Notification`, `SavedSearch` |
| **Documents** | `Document`, `UploadedFile` |
| **Journey** | `JourneyState`, `OnboardingProgress` |
| **Community** | `CommunityPost` |
| **Trust** | `TenantScore` |
| **Insurance** | `InsurancePolicy` |
| **Disputes** | `Dispute` |
| **Groups** | `HousingGroup`, `HousingGroupMember` |
| **Analytics** | `TelemetryEvent` |
| **Tours** | `TourBooking` |

---

## Authentication Flow

```mermaid
sequenceDiagram
    actor Student
    participant Browser
    participant Middleware
    participant LoginAction
    participant AuthLib
    participant SessionStore

    Student->>Browser: Submit login form
    Browser->>LoginAction: loginAction(formData)
    LoginAction->>LoginAction: Rate limit check (5/15min)
    alt Rate limited
        LoginAction-->>Browser: { error: "Troppi tentativi" }
    end
    LoginAction->>AuthLib: authenticateUser(email, password)
    AuthLib->>AuthLib: Find user by email
    AuthLib->>AuthLib: Check banned status
    AuthLib->>AuthLib: verifyPasswordSecure()
    Note over AuthLib: Supports bcrypt, legacy PBKDF2, legacy hash_*
    alt Invalid credentials
        AuthLib-->>LoginAction: null
        LoginAction-->>Browser: { error: "Credenziali non valide" }
    end
    AuthLib-->>LoginAction: User object
    LoginAction->>AuthLib: createSession(userId)
    AuthLib->>AuthLib: generateCsrfToken()
    AuthLib->>SessionStore: Create session (7-day TTL)
    AuthLib-->>LoginAction: { sessionId, csrfToken }
    LoginAction->>Browser: Set-Cookie: session_id, csrf_token
    LoginAction->>Browser: redirect("/dashboard")

    Note over Browser,Middleware: Subsequent requests
    Browser->>Middleware: Request with session cookie
    Middleware->>Middleware: Check protected paths
    alt /dashboard/* or /admin/*
        Middleware->>Middleware: Validate session_id cookie exists
        alt No session
            Middleware-->>Browser: redirect("/auth/login")
        end
    end
    Middleware->>Middleware: Set security headers (CSP, HSTS, etc.)
```

### Password Security

```
New Registration → bcrypt (cost 12)
Login Verification → Supports 3 formats:
  ├── $2a$/$2b$ → bcrypt.compare()
  ├── pbkdf2$*  → HMAC-SHA512 (legacy)
  └── hash_*    → Simple hash (demo seed data only)
```

---

## Payment Flow

```mermaid
sequenceDiagram
    actor Student
    actor Landlord
    participant App
    participant StripeService
    participant Stripe
    participant Webhook

    Note over Landlord,Stripe: 1. Landlord Onboarding
    Landlord->>App: Connect Stripe account
    App->>StripeService: createConnectedAccount()
    StripeService->>Stripe: Create Express account (MCC: 6513)
    Stripe-->>StripeService: { accountId, onboardingUrl }
    StripeService-->>App: Redirect to Stripe onboarding
    Landlord->>Stripe: Complete identity verification

    Note over Student,Stripe: 2. Student Payment
    Student->>App: Pay rent / deposit
    App->>App: createPaymentAction() + Zod validation
    App->>StripeService: createCheckoutSession()
    StripeService->>Stripe: Create Checkout Session
    Note over StripeService,Stripe: Platform fee: 5%<br/>Transfer to landlord account
    Stripe-->>Student: Redirect to Checkout page
    Student->>Stripe: Complete payment

    Note over Webhook,Stripe: 3. Async Confirmation
    Stripe->>Webhook: POST /api/webhooks/stripe
    Webhook->>Webhook: Verify stripe-signature
    Webhook->>App: Update payment status
    App->>App: dispatchNotification() → email + in-app

    Note over Student,Stripe: 4. Recurring Rent (optional)
    App->>StripeService: createRentSubscription()
    StripeService->>Stripe: Create Subscription (monthly)
    Note over StripeService: 5% application_fee_percent
```

### Payment Types

| Type | Description | Stripe Mode |
|---|---|---|
| `rent` | Monthly rent payment | `payment` (one-time) or `subscription` |
| `deposit` | Security deposit | `payment` (one-time) |
| `deposit_return` | Deposit refund | `refund` |
| `insurance_premium` | Insurance premium | `payment` (one-time) |

---

## AI Pipeline

```mermaid
graph TB
    subgraph Input["User Input"]
        NL["Natural Language Query"]
        DescReq["Description Request"]
        Chat["Chat Message"]
        Trans["Translation Request"]
    end

    subgraph AI["AI Service Layer"]
        Parse["parseNaturalLanguageSearch()"]
        Gen["generateListingDescriptionAI()"]
        Assist["chatWithAssistant()"]
        Translate["translateText()"]
    end

    subgraph LLM["OpenAI GPT-4o-mini"]
        Search["Search Parser<br/>(temp: 0, JSON mode)"]
        Writer["Copywriter<br/>(temp: 0.7, JSON mode)"]
        Assistant["Housing Assistant<br/>(temp: 0.7, 500 tokens)"]
        Translator["Translator<br/>(temp: 0)"]
    end

    subgraph Fallback["Fallback (no API key)"]
        KW["Keyword Matching"]
        Template["Template Generator"]
        Canned["Canned Responses"]
        Prefix["Prefix Mock"]
    end

    NL --> Parse
    DescReq --> Gen
    Chat --> Assist
    Trans --> Translate

    Parse -->|OPENAI_API_KEY set| Search
    Parse -->|No API key| KW
    Gen -->|OPENAI_API_KEY set| Writer
    Gen -->|No API key| Template
    Assist -->|OPENAI_API_KEY set| Assistant
    Assist -->|No API key| Canned
    Translate -->|OPENAI_API_KEY set| Translator
    Translate -->|No API key| Prefix

    Search --> Filters["SearchFilters object"]
    KW --> Filters
```

### Rate Limits

AI actions are rate-limited to **50 requests per 24 hours** per user to control API costs.

---

## Notification System

```mermaid
graph LR
    subgraph Triggers["Event Triggers"]
        T1["New message"]
        T2["Payment confirmed"]
        T3["New review"]
        T4["Listing match"]
        T5["System alert"]
    end

    subgraph Dispatcher["dispatchNotification()"]
        InApp["1. In-App<br/>(always)"]
        Email["2. Email<br/>(if configured)"]
        Push["3. Web Push<br/>(placeholder)"]
    end

    subgraph Channels["Delivery"]
        Store["notificationStore"]
        ResendAPI["Resend API"]
        ServiceWorker["Service Worker"]
    end

    T1 & T2 & T3 & T4 & T5 --> Dispatcher
    Dispatcher --> InApp --> Store
    Dispatcher --> Email --> ResendAPI
    Dispatcher --> Push --> ServiceWorker
```

### Email-Worthy Types (auto-send)

Payments, messages, reviews, and system notifications trigger email by default. Listing match notifications only trigger in-app alerts unless the user has saved search email preferences enabled.

---

## Data Access Strategy

The app uses a **dual-mode data access pattern** to support both development (no database) and production (PostgreSQL):

```mermaid
graph TB
    subgraph Actions["Server Actions / API Routes"]
        A1["Business Logic"]
    end

    subgraph Current["Current: InMemoryStore"]
        S1["stores.ts<br/>(domain stores)"]
        S2["auth.ts<br/>(user/session stores)"]
        S3["data.ts<br/>(listing store)"]
        DB["db.ts<br/>InMemoryStore&lt;T&gt;"]
    end

    subgraph Future["Ready: Prisma Repositories"]
        R1["UserRepository"]
        R2["ListingRepository"]
        R3["PaymentRepository"]
        R4["...7 more"]
        PC["Prisma Client"]
    end

    A1 --> S1 & S2 & S3
    S1 & S2 & S3 --> DB

    A1 -.->|"Migration path"| R1 & R2 & R3 & R4
    R1 & R2 & R3 & R4 --> PC
    PC --> PG[("PostgreSQL")]

    style Future stroke-dasharray: 5 5
```

### InMemoryStore API

```typescript
class InMemoryStore<T extends { id: string }> {
  findAll(): Promise<T[]>
  findById(id: string): Promise<T | undefined>
  create(item: T): Promise<T>
  update(id: string, updates: Partial<T>): Promise<T | undefined>
  delete(id: string): Promise<boolean>
  filter(predicate: (item: T) => boolean): Promise<T[]>
  count(): Promise<number>
  seed(items: T[]): void
}
```

---

## Security Architecture

### Middleware Pipeline

```mermaid
graph LR
    Req["Incoming Request"] --> MW["Edge Middleware"]
    MW --> H1["X-Content-Type-Options: nosniff"]
    MW --> H2["X-Frame-Options: DENY"]
    MW --> H3["X-XSS-Protection: 1; mode=block"]
    MW --> H4["Referrer-Policy: strict-origin"]
    MW --> H5["Content-Security-Policy"]
    MW --> H6["HSTS (production only)"]
    MW --> Auth{"Protected route?"}
    Auth -->|/dashboard/*| Check["Check session_id cookie"]
    Auth -->|/admin/*| Check
    Auth -->|Other| Pass["Pass through"]
    Check -->|Valid| Pass
    Check -->|Missing| Redirect["Redirect → /auth/login"]
```

### Security Features

| Feature | Implementation |
|---|---|
| **Password Hashing** | bcrypt (cost 12) |
| **CSRF Protection** | `crypto.randomBytes(32)` + `timingSafeEqual` |
| **Input Validation** | Zod schemas on all server actions |
| **XSS Prevention** | HTML stripping on all text inputs |
| **Rate Limiting** | In-memory sliding window |
| **CSP** | Strict Content-Security-Policy header |
| **HSTS** | Enabled in production (1 year, preload) |
| **Cookie Security** | HttpOnly, Secure, SameSite |
| **Webhook Verification** | Stripe signature validation |
| **Error Sanitization** | Sentry strips cookies and auth headers |

---

## External Integrations

All external services are **optional** with graceful fallbacks:

```mermaid
graph TB
    subgraph App["CasaStudente"]
        Core["Core Application"]
    end

    subgraph Required["Required for Full Features"]
        PG[("PostgreSQL<br/>via DATABASE_URL")]
    end

    subgraph Optional["Optional (Graceful Fallback)"]
        S["Stripe<br/>→ Mock payments"]
        AI["OpenAI<br/>→ Template generation"]
        E["Resend<br/>→ Console logging"]
        B["Vercel Blob<br/>→ Mock URLs"]
        SE["Sentry<br/>→ Console errors"]
        PH["PostHog<br/>→ Console events"]
    end

    Core --> PG
    Core --> S & AI & E & B & SE & PH

    style PG fill:#fef3c7
    style Optional fill:#f0fdf4
```

### Service Configuration Check

```typescript
// Available at runtime via /api/health
{
  stripe: isStripeConfigured(),       // !!STRIPE_SECRET_KEY
  email: isEmailConfigured(),         // !!RESEND_API_KEY
  blob: isBlobConfigured(),           // !!BLOB_READ_WRITE_TOKEN
  ai: isAIConfigured(),              // !!OPENAI_API_KEY
  monitoring: isMonitoringConfigured() // !!SENTRY_DSN || !!POSTHOG_API_KEY
}
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph Vercel["Vercel Platform"]
        Edge["Edge Network<br/>(Middleware, Static)"]
        Serverless["Serverless Functions<br/>(API Routes, SSR)"]
        Blob["Vercel Blob<br/>(File Storage)"]
    end

    subgraph DB["Database"]
        PG[("PostgreSQL<br/>(Managed)")]
    end

    subgraph Services["Third-Party Services"]
        S["Stripe"]
        AI["OpenAI"]
        E["Resend"]
        SE["Sentry"]
        PH["PostHog"]
    end

    Browser["Browser"] --> Edge
    Edge --> Serverless
    Serverless --> PG
    Serverless --> Blob
    Serverless --> S & AI & E
    Serverless --> SE & PH
```

### Build & Deploy

```bash
# Local development
npm run dev          # Next.js dev server on :3000

# Production build
npm run build        # Outputs to .next/

# Deploy
npx vercel           # Deploy to Vercel
```

### Environment-Specific Behavior

| Feature | Development | Production |
|---|---|---|
| Data store | InMemoryStore (seeded) | PostgreSQL (Prisma) |
| Logging | Human-readable with emoji | Structured JSON |
| HSTS | Disabled | Enabled (1 year) |
| Sentry sampling | 100% | 10% |
| Telemetry | Console buffered | PostHog batched |
| Passwords | bcrypt (same) | bcrypt (same) |
