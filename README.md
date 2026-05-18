# 🏠 CasaStudente — Student Housing Platform for Forlì

**CasaStudente** is a full-featured student housing marketplace built for the University of Bologna's Forlì campus. It connects students searching for accommodation with verified landlords, offering secure payments, AI-powered search, roommate matching, and multilingual support (IT/EN/ES/FR).

> **Status:** MVP with 70+ features, 24 Prisma models, 137 unit tests, and full E2E coverage.

---

## ✨ Key Features

| Category | Features |
|---|---|
| **Core** | Listing browser with filters & map, listing detail pages, neighborhood guides |
| **Auth & Security** | bcrypt password hashing, session cookies, CSRF tokens, role-based access (student / landlord / admin), university verification |
| **Payments** | Stripe Connect marketplace (checkout, subscriptions, refunds), platform fees, payment receipts |
| **Messaging** | Conversation threads per listing, real-time unread counts, AI-powered message translation |
| **AI** | Natural language search (OpenAI), listing description generator, multilingual chat assistant |
| **Roommates** | Profile-based matching with compatibility algorithm (budget, sleep, cleanliness, social, language) |
| **Reviews & Trust** | 5-dimension ratings, verified-lease badges, trust score with bronze/silver/gold tiers |
| **Notifications** | In-app + email (Resend), saved search alerts, notification hub with preference management |
| **Leases & Documents** | Digital lease contracts (transitorio, 4+4, 3+2), tax regime support (cedolare secca), document vault |
| **Admin** | User management, content moderation, analytics dashboard, telemetry viewer |
| **Advanced** | Tenant scoring, insurance policies, dispute resolution, housing groups, tour bookings, market forecasting |
| **Moonshots** | Guaranteed rent, co-living pods, digital twin apartments, student housing passport, resilience fund, arrival concierge |
| **Infra** | Sentry error tracking, PostHog analytics, Vercel Blob file storage, PWA offline support, i18n (4 languages) |

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, Lucide icons, CVA (class-variance-authority) |
| **Database** | PostgreSQL via [Prisma 7](https://www.prisma.io) (24 models) + InMemoryStore fallback for dev |
| **Auth** | bcrypt (cost 12), cookie-based sessions, CSRF protection |
| **Payments** | [Stripe](https://stripe.com) Connect (Express accounts, Checkout, Subscriptions, Webhooks) |
| **AI** | [OpenAI](https://openai.com) GPT-4o-mini (search parsing, description generation, chat, translation) |
| **Email** | [Resend](https://resend.com) (verification, receipts, notifications) |
| **Storage** | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (listing photos, documents, evidence) |
| **Monitoring** | [Sentry](https://sentry.io) (errors) + [PostHog](https://posthog.com) (product analytics) |
| **Testing** | [Vitest](https://vitest.dev) (unit) + [Playwright](https://playwright.dev) (E2E) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** (optional — the app falls back to in-memory stores for development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd casa-studente

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys (all external services are optional for local dev)

# Generate Prisma client
npm run db:generate

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Demo Accounts

The app seeds demo users automatically (in-memory mode):

| Role | Email | Password |
|---|---|---|
| Student | `martina.lopez@studio.unibo.it` | `password123` |
| Student | `luca.bianchi@studio.unibo.it` | `password123` |
| Landlord | `elena.rossi@casastudente.it` | `password123` |
| Admin | `admin@casastudente.it` | `admin123` |

---

## 📂 Project Structure

```
casa-studente/
├── prisma/
│   ├── schema.prisma          # 24 models, full relational schema
│   └── seed.ts                # Database seeding script
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── api/               # REST API endpoints
│   │   │   ├── auth/          # Authentication (logout)
│   │   │   ├── health/        # Health check
│   │   │   ├── institutional/ # Public data APIs (rents, vacancy, forecasts)
│   │   │   ├── landlord/      # Landlord-specific APIs
│   │   │   ├── listings/      # Listing CRUD
│   │   │   ├── moonshots/     # Experimental features
│   │   │   ├── upload/        # File upload
│   │   │   └── webhooks/      # Stripe webhooks
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── auth/              # Login, register, verify pages
│   │   ├── dashboard/         # User dashboard (30+ sub-pages)
│   │   ├── listings/          # Listing browse & detail
│   │   ├── neighborhoods/     # Zone guides + quiz
│   │   └── ...                # Community, calendar, roommates, etc.
│   ├── components/            # 22 React components
│   ├── generated/             # Prisma-generated client
│   ├── lib/                   # Core business logic
│   │   ├── actions/           # 29 Server Action modules
│   │   ├── repositories/      # 10 data access repositories
│   │   ├── services/          # 7 external service integrations
│   │   ├── stores/            # 25 in-memory domain stores
│   │   ├── auth.ts            # Authentication logic
│   │   ├── db.ts              # InMemoryStore base class
│   │   ├── i18n.ts            # Internationalization (4 languages)
│   │   ├── password.ts        # bcrypt hashing + legacy migration
│   │   ├── rate-limit.ts      # In-memory rate limiter
│   │   ├── utils.ts           # Tailwind class utilities
│   │   └── validation.ts      # Zod schemas for all inputs
│   └── middleware.ts          # Security headers, CSP, route protection
├── tests/unit/                # 9 test suites, 137 test cases
├── e2e/                       # Playwright E2E specs
└── package.json
```

---

## 🧪 Testing

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (requires dev server running)
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Test Coverage

| Suite | Tests | Covers |
|---|---|---|
| `db.test.ts` | 10 | InMemoryStore CRUD, filtering, seeding |
| `password.test.ts` | 14 | bcrypt hashing, legacy format migration, CSRF tokens |
| `validation.test.ts` | 23 | Zod schemas (listings, payments, reviews, messages, AI) |
| `stores.test.ts` | 16 | Domain stores (conversations, reviews, payments, notifications) |
| `features.test.ts` | 19 | Compatibility algorithm, trust scoring, distance calculations |
| `i18n.test.ts` | 18 | Translation keys, locale detection, formatting |
| `rate-limit.test.ts` | 15 | Rate limiting with window expiration |
| `ai-service.test.ts` | 14 | NL search fallback, description generation, chat |
| `moonshots.test.ts` | 8 | Experimental feature stores |

---

## 🔧 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run typecheck` | TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

---

## 🌐 Environment Variables

See [`.env.example`](.env.example) for all available variables. All external services are **optional** — the app provides graceful fallbacks:

| Variable | Service | Required? |
|---|---|---|
| `DATABASE_URL` | PostgreSQL | No (uses InMemoryStore) |
| `STRIPE_SECRET_KEY` | Stripe payments | No (mock mode) |
| `RESEND_API_KEY` | Email delivery | No (console logging) |
| `OPENAI_API_KEY` | AI features | No (template fallback) |
| `BLOB_READ_WRITE_TOKEN` | File storage | No (mock URLs) |
| `SENTRY_DSN` | Error tracking | No (console only) |
| `POSTHOG_API_KEY` | Product analytics | No (console only) |

---

## 📖 Documentation

- **[API Reference](docs/API.md)** — Complete REST API & Server Actions documentation
- **[Architecture](docs/ARCHITECTURE.md)** — System architecture with Mermaid diagrams

---

## 🚢 Deployment

The app is configured for **Vercel** deployment:

```bash
# Build for production
npm run build

# Or deploy via Vercel CLI
npx vercel
```

Required Vercel settings:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Environment Variables:** Set all required keys in the Vercel dashboard

---

## 📄 License

Source code is publicly available. No open-source license has been selected yet.
