# CasaStudente — Repository Analysis & Next-Gen Feature Planning

> **Analysis Date**: July 2025
> **Repository**: `forli/casa-studente`
> **Analyzed By**: Automated deep-dive — all 2,060 lines of source across 21 files

---

## Part 1: Core Feature Extraction

### Primary Purpose

CasaStudente is a vertical marketplace connecting University of Bologna (Forlì campus) students with verified landlords, solving a documented housing crisis where 78% of 2,400+ enrolled students are *fuorisede* (from outside the area) and must compete for scarce, opaque rental options currently fragmented across Facebook groups, classifieds, and offline agencies.

### Core Features (Current Implementation)

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 1 | **Listings Browser with Filters** | ✅ Built | Client-side filtering by zone, price range, property type, verification status, virtual tour availability, and utilities inclusion. 7 seed listings with rich data models. |
| 2 | **Listing Detail Pages** | ✅ Built | Dynamic `[id]` routes with full property info: pricing, features, photos (placeholder gradients), map placeholder, landlord profile, and nearby POIs. |
| 3 | **Landlord Dashboard** | ✅ Built | Sidebar-navigated shell with overview stats (4 KPI cards), recent activity feed, quick checklist, and monthly insight card. |
| 4 | **Dashboard Listings Management** | ✅ Built | Table view of landlord properties with status badges (Pubblicato/Bozza/In trattativa), inquiry counts, and last-updated timestamps. |
| 5 | **Messaging Inbox** | ✅ Built (UI only) | Thread list with unread indicators and a hardcoded conversation view. No real send/receive — placeholder for future server actions. |
| 6 | **Contact Form** | ✅ Built (UI only) | Per-listing contact form with pre-filled message template. `handleSubmit` toggles a "sent" state with no backend call. |
| 7 | **REST API** | ✅ Minimal | `GET /api/listings` and `GET /api/listings/[id]` returning in-memory data. No mutation endpoints. |

### Technical Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **Next.js 16.2.6** (App Router) | Bleeding-edge — uses `Promise<params>` pattern for route params |
| Language | **TypeScript 5** | Strict-ish config via create-next-app defaults |
| Styling | **Tailwind CSS 4** + `tailwind-merge` + `clsx` | Utility-first, no component library (shadcn/ui pattern without the library) |
| Icons | **Lucide React** | Lightweight icon set |
| UI Patterns | **class-variance-authority** | Installed but unused — ready for variant components |
| ORM | **Prisma 7.8** (declared) | Schema has a bare `User` model on SQLite. **Not wired to any page.** |
| Data Layer | **InMemoryStore** (`src/lib/db.ts`) | Generic `Map`-based store with CRUD + filter + seed. All data is in-memory per-process. |
| Fonts | **Geist / Geist Mono** via `next/font/google` | |
| Deployment target | **Vercel** (implied) | Default `next.config.ts`, `metadataBase` set to `casastudente.it` |

### Architecture Pattern

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing: Hero + Features + Pricing + CTA
│   ├── layout.tsx          # Root layout: Navbar + Footer, lang="it", OG meta
│   ├── listings/
│   │   ├── page.tsx        # Server component → passes data to ListingsBrowser
│   │   └── [id]/page.tsx   # Server component → generateMetadata + detail view
│   ├── dashboard/
│   │   ├── layout.tsx      # Client component → DashboardShell with sidebar
│   │   ├── page.tsx        # Overview KPIs + activity feed
│   │   ├── listings/       # Landlord property table
│   │   └── messages/       # Inbox UI
│   └── api/listings/       # GET-only REST endpoints
├── components/             # 8 reusable components (Hero, Navbar, Footer, etc.)
├── lib/
│   ├── data.ts             # 439 LOC — all seed data + data access functions
│   ├── db.ts               # InMemoryStore generic class
│   └── utils.ts            # cn() utility
└── generated/prisma/       # Prisma client output (auto-generated)
```

**Key observation**: The app follows a clean Server Component → Client Component data-flow pattern. Pages are server components that fetch data and pass it as props to interactive client components (e.g., `ListingsBrowser`). This is idiomatic Next.js App Router architecture.

### Target Users

1. **Primary — Students** (demand side): ~4,700 *fuorisede* students per year at Forlì campus, especially international/Erasmus students who cannot visit properties before arriving
2. **Primary — Landlords** (supply side): Owners of an estimated 3,000–5,000 vacant apartments in Forlì who fear bad tenants and lack digital tools
3. **Secondary — Agencies**: Small local agencies managing student rental portfolios (one agency, "Studio Affitti Romagna", appears in seed data)

### Unique Differentiators (Planned)

1. **University-verified students only** — enrollment confirmation required (not yet implemented)
2. **Forlì-specific knowledge** — neighborhood guides, campus distance, bus routes baked into listing data
3. **Italian legal compliance** — designed around *contratto transitorio* and *cedolare secca* tax regime
4. **Multilingual by design** — interface designed for IT/EN/ES (structural support, no i18n runtime yet)
5. **All-inclusive pricing transparency** — each listing shows rent, deposit, and utility policy upfront

---

## Part 2: Market Potential Analysis

### Market Size

| Level | Scope | Size Estimate |
|-------|-------|--------------|
| **TAM** | Italian student housing market | ~1.9M students × €500/mo avg = **€11.4B/year** in rent flow |
| **SAM** | Emilia-Romagna student housing | ~150K students × €500/mo = **€900M/year** |
| **SOM** | Forlì campus Year 1 | ~2,000 active renters × €550/mo = **€13.2M/year** in rent, with platform capturing 5% service fee on first month = **€55K** |

### Competitive Landscape

| Competitor | Type | Strengths | Weakness vs CasaStudente |
|-----------|------|-----------|--------------------------|
| **Stanza Semplice** | Direct (Forlì) | First-mover; rent guarantee model; local trust | Offline-first; limited tech; no roommate matching; no multilingual |
| **Immobiliare.it** | Generic portal | Massive traffic; brand recognition | No student features; no verification; no Forlì-specific knowledge |
| **Idealista** | Generic portal | Large inventory across Italy | No all-inclusive pricing; no university partnerships |
| **Facebook Groups** | Informal P2P | Free; large reach among students | Zero verification; scam-prone; unstructured; no landlord tools |
| **HousingAnywhere** | International platform | Good for exchange students | Generic; not Italy-focused; no Italian legal compliance tools |

**Key insight**: The only direct competitor (Stanza Semplice) entered Forlì in early 2026 with an offline-first model. The digital-first niche is effectively unoccupied.

### Current Traction

| Metric | Value |
|--------|-------|
| **Codebase maturity** | MVP / high-fidelity prototype — 2,060 LOC across 21 files |
| **Real users** | 0 (pre-launch) |
| **Database** | In-memory only; Prisma schema has 1 unused model |
| **Authentication** | None implemented |
| **Payments** | None implemented |
| **Deployment** | Not yet deployed (domain `casastudente.it` claimed in metadata) |

### Adoption Barriers

1. **No authentication** — cannot distinguish students from landlords; no enrollment verification
2. **No real database** — all data resets on process restart; no user-generated content possible
3. **No image uploads** — photo fields contain text descriptions, not actual images
4. **No payment processing** — Stripe/Satispay integration planned but absent
5. **No i18n runtime** — UI is Italian-only despite multilingual being a core differentiator
6. **Cold start problem** — marketplace needs both supply (listings) and demand (students) simultaneously
7. **Trust gap** — no reviews, no verification badges backed by real checks

### Growth Opportunities

- **Erasmus/international students**: 15.4% of UniBo students are foreign; they have the most acute need for remote-first housing search
- **Adjacent Romagna campuses**: Cesena, Ravenna, Rimini are 30 min away with identical problems
- **Young workers**: Forlì has growing tech/startup presence; non-student renters face similar issues
- **University institutional partnerships**: Er.Go (regional housing authority) has only 2,438 beds for 6,000+ students — official overflow referrals are realistic

---

## Part 3: Next-Gen Feature Proposals

| # | Feature Name | Description | Why Implement | Complexity | Impact |
|---|-------------|-------------|---------------|-----------|--------|
| 1 | **Authentication & Role System** | Implement NextAuth.js/Auth.js with email magic links + SPID integration. Separate student and landlord roles with different dashboard views and permissions. University enrollment verification via document upload. | Foundation for every other feature. Without auth, the platform cannot store user data, verify identities, or enable real interactions. Absolute prerequisite. | High | **10** |
| 2 | **Persistent Database & Listing CRUD** | Migrate from InMemoryStore to Prisma + PostgreSQL. Full CRUD for listings with image URLs, status transitions (draft→published→negotiating→rented), and audit trail. Landlords can create/edit/archive their own listings. | Without persistence, the app is a static demo. This unlocks user-generated content and makes the platform functional for real landlords. | Medium | **10** |
| 3 | **Image Upload & Virtual Tour Integration** | Add image upload (Cloudinary/S3) with drag-and-drop multi-upload, automatic resizing, and gallery display. Optional Matterport/iframe embed for 360° tours. Replace gradient placeholders with real property photos. | Visual trust is everything in housing. Students choosing remotely need real photos. This is the single biggest credibility gap in the current prototype. | Medium | **9** |
| 4 | **Real-Time Messaging System** | Build a server-backed messaging system between students and landlords. Conversation threads per listing with read receipts, email notifications for offline users, and auto-translated messages (Google Translate API) for international students. | Messaging removes platform leakage — if communication happens inside the app, users don't bypass it. Auto-translation directly serves the international student segment (15.4% of enrollment). | High | **9** |
| 5 | **Interactive Map with Geospatial Search** | Integrate Mapbox/Google Maps on the listings page. Each listing pinned by geocoded address. Filter by draw-a-boundary, distance from campus, proximity to bus stops. Replace the detail page map placeholder with a real map + walking/cycling time to campus. | Location is the #1 factor in student housing decisions. Map-based search is table stakes for any property platform and a major UX upgrade over text-only zone filters. | Medium | **8** |
| 6 | **Internationalization (i18n)** | Implement `next-intl` or similar with Italian (default), English, Spanish, Portuguese, German, and French. Extract all 100+ hardcoded Italian strings. URL prefix routing (`/en/listings`, `/es/listings`). Landlord listings auto-translated to all supported languages. | 15.4% of UniBo students are foreign (+53% growth in 3 years). SSLMIT (Forlì's flagship school) is literally a languages/interpreting faculty. Multilingual support is both a differentiator and a market expansion lever. | Medium | **8** |
| 7 | **Roommate Matching Algorithm** | Student profile system capturing study program, language, budget range, sleep schedule, cleanliness preference, and social habits. Compatibility scoring algorithm. Browse & connect interface for students seeking shared apartments. "Looking for roommate" flag on listings. | Roommate matching is a core promised feature with zero competition from generic platforms. It addresses a real pain point (random Facebook posts) and creates strong network effects — students invite friends to fill profiles. | High | **8** |
| 8 | **Reviews & Trust Score** | Dual-sided review system (students rate landlords/properties; landlords rate tenants). Verified review badges for completed leases. Aggregate trust scores displayed on profiles and listings. Report/flag system for suspicious content. | Trust is the #1 barrier for both sides: students fear scams, landlords fear bad tenants. A review system creates a reputational moat that generic platforms cannot replicate for Forlì-specific housing. | Medium | **7** |
| 9 | **Rent Payment & Digital Lease** | Stripe Connect marketplace integration for monthly rent collection. Platform holds funds and disburses to landlords. Digital lease generation using *contratto transitorio* templates with PDF signature. Automatic PagoPA receipt generation. Cedolare secca tax reporting export. | Payment processing is the highest-revenue feature (8–10% rent guarantee premium = €660/year/property). Digital lease signing eliminates a major friction point for international students who cannot sign in person. | High | **7** |
| 10 | **Smart Notifications & Availability Alerts** | Students set saved searches with criteria (zone, price, type). Push/email notifications when matching listings appear. Landlords get reminders to update availability before semester deadlines. Automated "still available?" pings to keep listing data fresh. | Reduces time-to-match (critical in a market where 45-bed residences fill in 20 days). Keeps data fresh without manual landlord effort. Standard feature that users expect from modern marketplaces. | Low | **7** |

### Scoring Methodology Applied

Each score reflects the weighted composite:
- **User Impact (40%)**: Does this remove a blocking pain point or significantly improve UX?
- **Market Differentiation (30%)**: Does this create moat vs. Facebook Groups / Immobiliare.it / Stanza Semplice?
- **Adoption Potential (20%)**: Will this attract new user segments or expand use cases?
- **Technical Leverage (10%)**: Does this enable future features or integrations?

---

## Part 4: Implementation Roadmap

### Feature 1: Authentication & Role System
- **Effort Estimate**: 3–4 person-weeks
- **Prerequisites**: Database migration (Feature 2 — can be done in parallel during week 1)
- **Implementation Phases**:
  1. **Auth foundation** (Week 1): Set up Auth.js v5 with email magic link provider. User table in Prisma. Session management with JWT. — *5 days*
  2. **Role system** (Week 2): Student/Landlord role enum. Conditional dashboard routing. Protected API routes with middleware. — *5 days*
  3. **Verification flow** (Week 3–4): Document upload for university enrollment certificate. Admin review queue. SPID OAuth provider integration (optional, can defer). — *5–10 days*
- **Success Metrics**: 80%+ of listing creators complete landlord verification within 48h; <5% drop-off during sign-up flow
- **Risks & Mitigations**:
  - *SPID integration complexity* → Start with email-only auth; add SPID as an optional verification layer later
  - *Role gaming (student signs up as landlord)* → Enrollment certificate verification + admin review for landlords publishing listings

### Feature 2: Persistent Database & Listing CRUD
- **Effort Estimate**: 2–3 person-weeks
- **Prerequisites**: PostgreSQL instance (Supabase/Neon free tier for MVP)
- **Implementation Phases**:
  1. **Schema design & migration** (Week 1): Expand Prisma schema: User, Listing, ListingImage, Message models. Run initial migration. Seed script. — *4 days*
  2. **Server Actions for CRUD** (Week 1–2): Next.js Server Actions for create/update/delete listings. Form validation with Zod. Optimistic UI updates. — *5 days*
  3. **Dashboard integration** (Week 2–3): Wire landlord dashboard to real data. Listing status state machine (draft→published→negotiating→rented→archived). — *4 days*
- **Success Metrics**: Landlords can publish a listing end-to-end in <5 min; zero data loss across deployments
- **Risks & Mitigations**:
  - *Data model changes during early iteration* → Use Prisma migrations with `--create-only` for review before applying
  - *SQLite→PostgreSQL migration* → Already using Prisma abstraction; swap datasource provider in one line

### Feature 3: Image Upload & Virtual Tour Integration
- **Effort Estimate**: 2 person-weeks
- **Prerequisites**: Cloud storage account (Cloudinary free tier: 25K transformations/mo)
- **Implementation Phases**:
  1. **Upload pipeline** (Week 1): Cloudinary SDK integration. Drag-and-drop multi-image upload component. Auto-resize to 3 sizes (thumbnail, card, full). EXIF stripping for privacy. — *5 days*
  2. **Gallery & tour display** (Week 2): Responsive image gallery on listing detail page. Lightbox viewer. Optional Matterport/YouTube iframe embed field for virtual tours. — *4 days*
  3. **Image moderation** (Week 2): Basic content moderation via Cloudinary AI add-on. Maximum 10 images per listing. — *1 day*
- **Success Metrics**: 70%+ of published listings have ≥3 photos within 30 days of launch; average image load time <1.5s on 4G
- **Risks & Mitigations**:
  - *Storage costs scaling* → Cloudinary free tier covers MVP; switch to S3+CloudFront at scale with aggressive caching
  - *Low-quality uploads* → Provide photo guidelines during upload; minimum resolution requirement

### Feature 4: Real-Time Messaging System
- **Effort Estimate**: 3–4 person-weeks
- **Prerequisites**: Auth system (Feature 1), Database (Feature 2)
- **Implementation Phases**:
  1. **Message model & API** (Week 1): Prisma `Conversation` and `Message` models. Server Actions for send/read. Conversation list API. — *5 days*
  2. **Chat UI** (Week 2): Replace hardcoded messages page with real data. Conversation thread component. Unread count badges. Optimistic message sending. — *5 days*
  3. **Notifications & translation** (Week 3–4): Email notifications for offline recipients (Resend/SendGrid). Google Translate API for auto-translation toggle. Read receipts. — *5–8 days*
- **Success Metrics**: 60%+ of inquiries happen through in-platform messaging (vs. external email/WhatsApp); median response time <4h
- **Risks & Mitigations**:
  - *Users bypassing platform (sharing phone/WhatsApp)* → Allow it initially; add value with auto-translation and inquiry tracking
  - *Translation quality* → Flag auto-translated messages clearly; let users toggle original/translated

### Feature 5: Interactive Map with Geospatial Search
- **Effort Estimate**: 2 person-weeks
- **Prerequisites**: Database with geocoded addresses (Feature 2)
- **Implementation Phases**:
  1. **Geocoding & data** (Week 1): Batch-geocode existing addresses via Mapbox Geocoding API. Add `latitude`/`longitude` to Listing model. Campus coordinates as reference point. — *2 days*
  2. **Map component** (Week 1): `react-map-gl` (Mapbox GL JS wrapper). Listing pins with price labels. Click-to-preview popup. Cluster markers at zoom-out levels. — *3 days*
  3. **Geospatial search** (Week 2): Distance-from-campus filter. Draw-a-boundary search. Walking/cycling time estimation. Replace detail page map placeholder. — *5 days*
- **Success Metrics**: 40%+ of users interact with the map view; map search produces equivalent or better results vs. text filters
- **Risks & Mitigations**:
  - *Mapbox costs* → Free tier covers 50K map loads/mo (sufficient for years at Forlì scale); fallback to Leaflet+OSM if needed
  - *Geocoding accuracy in Italian addresses* → Manual verification of all geocoded coordinates for Forlì

### Feature 6: Internationalization (i18n)
- **Effort Estimate**: 2–3 person-weeks
- **Prerequisites**: None (can run in parallel with any other feature)
- **Implementation Phases**:
  1. **i18n setup** (Week 1): Install `next-intl`. Configure locale routing (`/it/`, `/en/`, `/es/`). Extract ~120 UI strings into JSON message files. Set up Italian as default with fallback. — *5 days*
  2. **Core translations** (Week 2): Professional translation of UI strings into English, Spanish, Portuguese. Community/AI-assisted for German, French. Listing content translation via API. — *5 days*
  3. **Locale-aware components** (Week 2–3): Date/currency formatting per locale. Language switcher in navbar. SEO hreflang tags. RTL-readiness (future-proofing). — *3 days*
- **Success Metrics**: 25%+ of sessions use non-Italian locale within first semester; international student sign-up rate ≥ Italian student rate
- **Risks & Mitigations**:
  - *Translation maintenance burden* → Use ICU message format; automate extraction with `next-intl` CLI
  - *Listing content is Italian-only* → Auto-translate listing descriptions with quality disclaimer badge

### Feature 7: Roommate Matching Algorithm
- **Effort Estimate**: 3–4 person-weeks
- **Prerequisites**: Auth system (Feature 1), Database (Feature 2)
- **Implementation Phases**:
  1. **Student profile** (Week 1): Profile schema: study program, languages, budget range, sleep schedule (early/late), cleanliness (1–5), social preference (quiet/social), pet tolerance, smoking. Onboarding flow. — *5 days*
  2. **Matching algorithm** (Week 2): Weighted compatibility score across profile dimensions. Budget overlap check. Language compatibility bonus. "Looking for roommate" listing flag with room count. — *5 days*
  3. **Browse & connect UI** (Week 3–4): Roommate browse page with compatibility percentages. "Send roommate request" flow. Group formation for multi-room apartments. Integration with messaging. — *5–8 days*
- **Success Metrics**: 30%+ of students complete roommate profile; 15%+ of successful matches involve roommate pairing
- **Risks & Mitigations**:
  - *Cold start (few profiles)* → Launch roommate matching during July–August peak when interest is highest
  - *Privacy concerns* → Profile visible only to other verified students; no public display

### Feature 8: Reviews & Trust Score
- **Effort Estimate**: 2–3 person-weeks
- **Prerequisites**: Auth (Feature 1), Database (Feature 2), completed rental period for review eligibility
- **Implementation Phases**:
  1. **Review model** (Week 1): Schema: reviewer, reviewee, listing, rating (1–5 stars across categories), text comment, verified-lease flag. Moderation queue. — *4 days*
  2. **Review UI** (Week 1–2): Review submission form (post-lease trigger). Star display on listing cards and landlord profiles. Aggregate score calculation. — *4 days*
  3. **Trust scoring** (Week 2–3): Composite trust score from review average, response rate, verification status, account age. Badge system (Bronze/Silver/Gold). Report/flag mechanism. — *5 days*
- **Success Metrics**: 40%+ of completed leases generate a review; average landlord trust score >4.0/5.0 within 6 months
- **Risks & Mitigations**:
  - *Fake reviews* → Only allow reviews between users who had a verified lease relationship
  - *Retaliation reviews* → Both parties review simultaneously (sealed until both submit, like Airbnb)

### Feature 9: Rent Payment & Digital Lease
- **Effort Estimate**: 5–6 person-weeks
- **Prerequisites**: Auth (Feature 1), Database (Feature 2), legal counsel for contract templates
- **Implementation Phases**:
  1. **Stripe Connect setup** (Week 1–2): Marketplace Stripe Connect integration. Landlord onboarding (KYC). Monthly payment scheduling with automatic platform fee deduction. — *8 days*
  2. **Digital lease generation** (Week 3–4): *Contratto transitorio* template engine (dynamic fields: tenant, landlord, property, duration, rent, deposit). PDF generation. E-signature integration (DocuSign API or open-source alternative). — *8 days*
  3. **Tax & receipts** (Week 5–6): Cedolare secca calculator. Annual tax reporting CSV export. PagoPA receipt number generation. Payment history dashboard for both parties. — *5–8 days*
- **Success Metrics**: 50+ properties enrolled in rent guarantee program by Month 12; €132K ARR from rent guarantee premiums
- **Risks & Mitigations**:
  - *Italian payment regulations* → Consult fintech lawyer; Stripe Connect is PSD2-compliant in Italy
  - *Legal liability for lease templates* → Disclaimer + partnership with local *avvocato*; templates reviewed by legal counsel

### Feature 10: Smart Notifications & Availability Alerts
- **Effort Estimate**: 1–2 person-weeks
- **Prerequisites**: Auth (Feature 1), Database (Feature 2)
- **Implementation Phases**:
  1. **Saved searches** (Week 1): SavedSearch model (criteria JSON, notification preference). "Save this search" button on listings page. Cron job or database trigger for new-match detection. — *4 days*
  2. **Notification delivery** (Week 1–2): Email notifications via Resend (free tier: 100 emails/day). In-app notification bell with unread count. Landlord reminder emails before semester deadlines (configurable). — *3 days*
  3. **Data freshness** (Week 2): Automated "still available?" emails to landlords after 30 days. Auto-archive listings with no response after 14 days. Listing freshness indicator on cards. — *3 days*
- **Success Metrics**: 50%+ of active students have ≥1 saved search; 70%+ of landlords respond to availability check within 48h
- **Risks & Mitigations**:
  - *Notification fatigue* → Default to weekly digest; let users opt into real-time alerts
  - *Email deliverability* → Use dedicated sending domain with DKIM/SPF; start with transactional emails only

---

## Part 5: Executive Summary

```
┌─────────────────────────────────────────────────────────┐
│ PROJECT VIABILITY SCORECARD                             │
├─────────────────────────────────────────────────────────┤
│ Current Market Fit:        [7/10] ███████░░░            │
│ Growth Potential:          [9/10] █████████░            │
│ Technical Foundation:      [7/10] ███████░░░            │
│ Community Health:          [2/10] ██░░░░░░░░            │
│ Competitive Position:      [8/10] ████████░░            │
├─────────────────────────────────────────────────────────┤
│ OVERALL SCORE:             [7/10] ███████░░░            │
└─────────────────────────────────────────────────────────┘
```

**Score Justification:**

- **Market Fit (7)**: The housing crisis is empirically validated (rector statements, press coverage, 20+ inquiries/day for 45-bed residence). The product concept directly addresses both sides' pain points. Docked 3 points because the current build is a prototype, not a usable product — zero real transactions have occurred.

- **Growth Potential (9)**: The expansion path is clear and proven: Forlì (2K students) → all UniBo Romagna (8K) → Bologna (90K) → Italy (1.9M). Network effects are strong in local housing marketplaces. The €11.4B TAM is real.

- **Technical Foundation (7)**: Clean, idiomatic Next.js 16 architecture with proper server/client component separation. TypeScript throughout. Well-structured data model ready for database migration. However: no auth, no persistence, no tests, no CI/CD, no error handling. The `InMemoryStore` is a placeholder, not production infrastructure.

- **Community Health (2)**: Pre-launch solo project. No contributors, no users, no public repository activity. This is expected at this stage but represents a risk — the project depends entirely on one person.

- **Competitive Position (8)**: Only one offline-first competitor (Stanza Semplice). All generic platforms (Immobiliare.it, Idealista, Facebook) lack student-specific features. The digital-first, multilingual, verified-listings niche is genuinely unoccupied in Forlì. Window of opportunity is open but time-limited.

---

### Bottom Line

**CasaStudente has exceptional market-problem fit targeting a validated, acute housing crisis with weak competition and a clear expansion path.** The current codebase is a well-architected high-fidelity prototype (~2K LOC) that demonstrates product thinking but lacks every production essential: authentication, persistence, image handling, and real interactions. **The single most important next step is to ship Features 1+2 (Auth + Database) in parallel within 4 weeks, then immediately onboard 50 real Forlì landlords before the July–August 2026 rental search peak.** The technical gap to a launchable MVP is ~8–10 person-weeks; the market window is narrow but wide open.

---

### Recommended Implementation Timeline

```
         Week 1–4              Week 5–8              Week 9–12             Week 13–16
    ┌──────────────┐     ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │ Auth + DB    │     │ Images +     │      │ Messaging +  │      │ Payments +   │
    │ (Features    │────▶│ Maps         │─────▶│ i18n +       │─────▶│ Reviews +    │
    │  1 & 2)      │     │ (Features    │      │ Notifications│      │ Roommate     │
    │              │     │  3 & 5)      │      │ (4, 6, 10)   │      │ (7, 8, 9)    │
    └──────────────┘     └──────────────┘      └──────────────┘      └──────────────┘
         MVP v0.1             MVP v0.5            Beta Launch          Full Platform
    (functional app)    (visual trust)      (real interactions)     (revenue-generating)
```

**Total estimated effort**: 24–32 person-weeks for all 10 features (6–8 months solo, 3–4 months with 2 developers).
