# CasaStudente — Iteration 2: Next-Gen Feature Planning

> **Analysis Date**: July 2025
> **Repository**: `forli/casa-studente`
> **Iteration**: 2 (builds on [ANALYSIS.md](./ANALYSIS.md))
> **Codebase**: 5,871 LOC across 34 source files, 18 committed features

---

## Context: What Already Exists

Before proposing new features, here's a comprehensive map of the **18 features** already implemented across 18 commits:

| # | Feature | Key Files | Integration Points |
|---|---------|-----------|-------------------|
| 1 | Auth with roles (student/landlord/admin) | `auth.ts`, `auth/login`, `auth/register`, `auth/verify` | Session cookies, role gating, user menu |
| 2 | Listing CRUD + API | `actions/listings.ts`, `api/listings/` | Server actions, status transitions |
| 3 | Image upload with drag-and-drop | `image-upload.tsx` | Gallery with lightbox on detail page |
| 4 | Listing browser with filters | `listings-browser.tsx` | Zone, price, type, verified, virtual tour |
| 5 | Listing detail pages | `listings/[id]/page.tsx` | Gallery, map, reviews, contact form |
| 6 | Interactive SVG map | `listing-map.tsx` | Campus distance, walking/cycling times |
| 7 | Real-time messaging | `messages-view.tsx`, `actions/messages.ts` | Per-listing threads, read state |
| 8 | Roommate matching algorithm | `roommate-list.tsx`, `stores.ts` | 7-dimension compatibility scoring |
| 9 | Reviews & trust scores | `review-list.tsx`, `actions/reviews.ts` | Dual-sided, verified lease badges |
| 10 | Rent payments | `dashboard/payments/` | Stripe-style flow, platform fees |
| 11 | Digital lease contracts | `stores.ts` (LeaseContract) | Transitorio/4+4/3+2, cedolare secca |
| 12 | Notifications | `notifications/page.tsx`, `actions/notifications.ts` | Cross-feature alerts |
| 13 | Saved searches with alerts | `savedSearchStore` | Criteria-based matching |
| 14 | i18n (IT/EN) | `i18n.ts`, `language-switcher.tsx` | 84 translation keys, cookie-based |
| 15 | Dashboard with KPIs | `dashboard/page.tsx`, `dashboard.tsx` | Overview stats, activity feed |
| 16 | Dashboard listings management | `dashboard/listings/` | Status badges, create form |
| 17 | University verification flow | `auth/verify/page.tsx` | Document upload, verification status |
| 18 | Contact form per listing | `contact-form.tsx` | Pre-filled message template |

**What the previous analysis proposed (all now implemented)**: Auth, DB CRUD, image upload, messaging, interactive map, i18n, roommate matching, reviews, payments/leases, notifications.

---

## Part 1: Current State Assessment

### Architectural Maturity

The codebase has evolved from a 2K LOC prototype to a 5.8K LOC feature-rich application. However, key architectural gaps remain:

| Dimension | Status | Gap |
|-----------|--------|-----|
| **Persistence** | ❌ Still InMemoryStore | All data resets on restart. Prisma schema has only a bare `User` model |
| **Auth security** | ⚠️ Demo-grade | Hash function is `(hash << 5) - hash + char` — not bcrypt/argon2 |
| **Testing** | ❌ Zero tests | No unit, integration, or E2E tests. No CI/CD pipeline |
| **Error handling** | ❌ Minimal | No error boundaries, no toast notifications, no form validation feedback |
| **Accessibility** | ⚠️ Basic | Semantic HTML exists but no ARIA attributes, keyboard nav, or screen reader testing |
| **Performance** | ⚠️ Untested | No image optimization pipeline, no lazy loading, no bundle analysis |
| **Deployment** | ❌ Not deployed | No hosting config, no environment variable management |

### Feature Integration Depth

While 18 features exist, integration between them is **shallow**:

- **Reviews ↔ Payments**: Reviews reference `listingId` but don't enforce "review only after completed lease"
- **Messaging ↔ Notifications**: Message notifications exist in seed data but `sendMessageAction` doesn't trigger `createNotification`
- **Saved searches ↔ Listings**: `saveSearchAction` stores criteria but no background job matches new listings
- **Roommates ↔ Messaging**: No "contact this roommate" flow — the systems are side-by-side, not connected
- **Map ↔ Filters**: Map and listing browser are separate views; no "search this area" integration
- **Payments ↔ Leases**: Both exist but lease signing doesn't trigger first payment
- **i18n coverage**: Only navbar, homepage, listings page, and auth pages use `t()` — dashboard, messages, reviews, payments are hardcoded Italian

---

## Part 2: Market Potential Update

### Competitive Landscape Shift

Since the initial analysis, the platform's feature density has grown significantly. Updated competitive comparison:

| Capability | CasaStudente | Stanza Semplice | Immobiliare.it | HousingAnywhere | Facebook Groups |
|-----------|:---:|:---:|:---:|:---:|:---:|
| Roommate matching | ✅ | ❌ | ❌ | ❌ | ❌ |
| Trust scoring | ✅ | ❌ | ❌ | ⚠️ Basic | ❌ |
| Digital leases | ✅ | ❌ | ❌ | ❌ | ❌ |
| Campus distance | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bilingual (IT/EN) | ✅ | ❌ | ✅ | ✅ | ❌ |
| Rent payments | ✅ | ✅ | ❌ | ✅ | ❌ |
| Saved search alerts | ✅ | ❌ | ✅ | ✅ | ❌ |

**Key insight**: CasaStudente now has more student-specific features than any competitor. The gap is no longer features — it's **production readiness and go-to-market execution**.

### Growth Bottlenecks (Updated)

1. **No production database** — the #1 blocker. Nothing works in production without persistence.
2. **No deployment** — domain `casastudente.it` claimed in metadata but app is localhost-only.
3. **Feature silos** — 18 features exist independently; cross-feature workflows are missing.
4. **No analytics** — zero insight into user behavior, funnel conversion, or feature adoption.
5. **No onboarding flow** — new users land on a marketing page with no guided path to value.

---

## Part 3: Next-Gen Feature Proposals (Iteration 2)

These proposals are explicitly **new** — none duplicate features from the initial analysis or existing implementation. They focus on three themes: **cross-feature integration**, **production hardening**, and **growth levers**.

| # | Feature Name | Description | Why Implement | Complexity | Impact |
|---|-------------|-------------|---------------|:----------:|:------:|
| 1 | **Rental Journey Orchestrator** | End-to-end workflow engine connecting the search→contact→visit→application→lease→payment→review pipeline. State machine tracking each student-listing relationship through stages with automated triggers (e.g., signing a lease auto-creates first payment, completing a lease auto-prompts review). | Individual features exist but no connected journey. This transforms 8 isolated tools into one coherent product. Reduces drop-off at every stage transition and enables funnel analytics. | High | **10** |
| 2 | **Admin Dashboard & Moderation Console** | Back-office for platform operators: user management, listing approval queue, review moderation, flagged content triage, verification document review, platform-wide analytics (KPIs, conversion funnels, revenue). Role-based access for admin users. | The platform has no admin tooling. Verification requests go nowhere, flagged reviews pile up, no one can moderate listings. Without admin tools, the platform cannot operate at any scale. | High | **9** |
| 3 | **Guided Onboarding & Profile Wizard** | Multi-step onboarding flow after registration: students fill roommate profile, set saved searches, and get personalized listing recommendations. Landlords are guided through first listing creation with photo tips, pricing suggestions, and compliance checklist. Progress indicator with completion rewards. | The current post-registration experience is a blank dashboard. 60%+ of marketplace users churn in the first session without completing key actions. Guided onboarding directly increases activation rate and data quality. | Medium | **9** |
| 4 | **AI-Powered Listing Assistant** | OpenAI/Anthropic integration for: (a) auto-generating listing descriptions from photos + basic details in both IT/EN, (b) smart search with natural language queries ("monolocale vicino al campus sotto 500€ con WiFi"), (c) auto-translating message threads for international students, (d) chatbot for FAQ and platform guidance. | Landlords write poor descriptions; students struggle with Italian listings; the search UI has too many filters. AI bridges all three gaps and creates a "wow" differentiator no competitor offers. | Medium | **9** |
| 5 | **Semester Calendar & Availability Sync** | Academic calendar integration: semester start/end dates, enrollment deadlines, Er.Go housing application windows. Listings auto-tagged with availability relative to academic timeline ("Available for Spring 2027 semester"). Landlords set recurring availability patterns. Students get "application deadline approaching" alerts. | Housing search is inherently seasonal (July–September peak). No platform maps listings to the academic calendar. This reduces the #1 student anxiety ("will it be available when I need it?") and helps landlords time their postings optimally. | Medium | **8** |
| 6 | **Neighborhood Intelligence Hub** | Rich neighborhood profiles for each Forlì zone: safety ratings, noise levels, grocery stores, pharmacies, restaurants, bus routes with frequency, average rents (from platform data), student density, nightlife index. User-contributed tips and photos. Data-driven "best neighborhood for you" quiz based on student preferences. | Location is the #1 factor in housing decisions but the current platform only shows walking distance to campus. Deep local knowledge is CasaStudente's moat — no national platform will build Forlì-specific neighborhood guides. | Medium | **8** |
| 7 | **Document Vault & Compliance Center** | Secure document storage for lease contracts, ID copies, university enrollment certificates, payment receipts, tax declarations. Automated cedolare secca tax calculation with annual CSV export. Contract renewal reminders 60/30/15 days before expiry. Template library for common Italian rental documents. | Italian rental bureaucracy is the #2 pain point after finding housing. Students lose documents, miss deadlines, don't understand tax obligations. A compliance center adds irreplaceable value and increases platform stickiness post-lease. | Medium | **8** |
| 8 | **Social Proof & Community Feed** | Activity feed showing anonymized platform activity ("3 students found housing in Centro this week"), success stories, student tips, and landlord spotlights. Social sharing for listings. Integration with university orientation channels. "Student life in Forlì" content hub. | Solves the cold-start trust problem. Social proof is the cheapest user acquisition channel. A community layer transforms transactional usage into habitual engagement and generates organic word-of-mouth. | Low | **7** |
| 9 | **Multi-Campus Expansion Framework** | Architectural refactoring for multi-campus support: campus selector, campus-specific data partitioning, shared user accounts across campuses. Data model changes: campus entity, campus-listing relationships, campus-specific neighborhood data. Initial expansion to Cesena and Ravenna (UniBo Romagna). | Forlì has ~2,400 students. UniBo Romagna (Forlì + Cesena + Ravenna) has ~8,000. This 3× the addressable market with minimal feature work — the same product serves identical needs. Multi-campus is the primary growth vector. | High | **7** |
| 10 | **Performance & Reliability Stack** | Production hardening: PostgreSQL migration (Prisma already abstracted), Redis for session storage, proper password hashing (bcrypt), rate limiting, error boundaries with toast notifications, Sentry error tracking, Lighthouse performance audit + fixes, automated backups, health check endpoints. CI/CD with GitHub Actions (lint + type-check + build). | None of the 18 features work in production without this. The InMemoryStore loses all data on restart. The hash function is trivially breakable. There are no tests, no error handling, no monitoring. This is the unglamorous foundation everything else depends on. | High | **7** |

### Scoring Methodology (Iteration 2)

Same weighted composite as Iteration 1, but with a **production readiness bonus**: features that bridge the gap between "demo" and "deployable" receive +1 in User Impact.

- **User Impact (40%)**: Does this remove a blocking pain point or enable a workflow that's currently impossible?
- **Market Differentiation (30%)**: Does this create moat vs. competitors or deepen Forlì-specific value?
- **Adoption Potential (20%)**: Will this attract new users, reduce churn, or increase engagement?
- **Technical Leverage (10%)**: Does this enable future features, integrations, or scaling?

---

## Part 4: Implementation Roadmap

### Feature 1: Rental Journey Orchestrator
- **Effort Estimate**: 4–5 person-weeks
- **Prerequisites**: Production database (Feature 10), Admin dashboard (Feature 2) for monitoring
- **Implementation Phases**:
  1. **Journey data model** (Week 1): `RentalJourney` model with states: `discovered → contacted → visiting → applied → lease_pending → lease_signed → active_tenancy → completed → reviewed`. State transition rules with validation. Trigger registry mapping transitions to side effects. — *5 days*
  2. **Automated triggers** (Week 2–3): Wire existing features to journey transitions: `lease_signed` → create first payment + send notification; `active_tenancy` end date → prompt review; `contacted` → create conversation; `visiting` → send listing details + map link. Idempotent action dispatch. — *8 days*
  3. **Journey dashboard** (Week 4–5): Student view: "My housing journey" progress tracker for each listing they've interacted with. Landlord view: pipeline view showing all applicants by stage. Journey analytics: average time per stage, conversion rates, drop-off points. — *7 days*
- **Success Metrics**: 70%+ of lease signings follow the orchestrated journey path; average time from first contact to lease signing decreases by 30%; review submission rate increases to 60%+ (from current 0% baseline)
- **Risks & Mitigations**:
  - *Over-engineering the state machine* → Start with 5 core states, add intermediate states only when data shows drop-offs
  - *Users bypassing the journey* → Allow manual state overrides; track "organic" vs "guided" journeys separately

### Feature 2: Admin Dashboard & Moderation Console
- **Effort Estimate**: 3–4 person-weeks
- **Prerequisites**: Production database (Feature 10)
- **Implementation Phases**:
  1. **Admin layout & access control** (Week 1): `/admin` route group with middleware enforcing `role === 'admin'`. Dashboard shell with sidebar navigation. Platform-wide KPI cards: total users, active listings, pending verifications, revenue. — *4 days*
  2. **Moderation queues** (Week 2): Verification document review queue (approve/reject with reason). Listing approval queue (first listing from each new landlord). Flagged review triage. User management table with search, role editing, ban/suspend. — *5 days*
  3. **Analytics & reporting** (Week 3–4): Conversion funnel visualization (signup → profile → first search → first contact → lease). Revenue dashboard (payments, platform fees, MRR). Listing inventory health (stale listings, photo quality distribution). Export to CSV for offline analysis. — *6 days*
- **Success Metrics**: Verification requests processed within 24h (currently: never); 95%+ of flagged content reviewed within 48h; admin can answer "how is the platform doing?" in <30 seconds
- **Risks & Mitigations**:
  - *Admin fatigue at scale* → Implement auto-approve rules for returning landlords with good trust scores
  - *Privacy concerns with user data access* → Audit log for all admin actions; minimize PII visibility

### Feature 3: Guided Onboarding & Profile Wizard
- **Effort Estimate**: 2–3 person-weeks
- **Prerequisites**: Auth system (exists), roommate profiles (exist), saved searches (exist)
- **Implementation Phases**:
  1. **Student onboarding flow** (Week 1): Post-registration redirect to `/onboarding`. Steps: (1) complete profile photo + bio, (2) fill roommate preferences, (3) set first saved search, (4) browse 3 recommended listings. Progress bar with skip option. Completion reward: "Early Adopter" badge. — *5 days*
  2. **Landlord onboarding flow** (Week 1–2): Steps: (1) verify identity/ownership, (2) create first listing with AI-assisted description, (3) set pricing with market comparison, (4) add photos with quality tips overlay, (5) publish + share. Checklist persists in dashboard until complete. — *5 days*
  3. **Personalized recommendations** (Week 2–3): "For You" listing feed based on roommate profile (budget, zone, preferences). Recommendation algorithm: weighted scoring across price match, zone preference, feature overlap, roommate availability. A/B test onboarding completion with/without recommendations. — *4 days*
- **Success Metrics**: 80%+ of new students complete ≥3 onboarding steps; 50%+ of landlords publish first listing within 48h of registration; time-to-first-meaningful-action drops from ∞ to <10 minutes
- **Risks & Mitigations**:
  - *Onboarding friction causing drop-off* → Make every step skippable; show clear value proposition for each step
  - *Recommendation cold start* → Fall back to popularity-based ranking until enough user data exists

### Feature 4: AI-Powered Listing Assistant
- **Effort Estimate**: 3–4 person-weeks
- **Prerequisites**: Production database (Feature 10), image upload (exists)
- **Implementation Phases**:
  1. **Description generator** (Week 1): Server action calling OpenAI GPT-4o-mini with structured prompt: listing metadata (type, size, features, zone) → professional Italian + English description. "Generate description" button on listing creation form. Edit-before-publish flow. — *4 days*
  2. **Natural language search** (Week 2): Search bar accepting free-text queries. NLP pipeline: extract intent (search/question/action), entities (zone, price range, features), and filters. Map to existing filter parameters. Fallback to keyword search. — *5 days*
  3. **Message translation & chatbot** (Week 3–4): Auto-detect language in messages, offer inline translation toggle. Platform FAQ chatbot (trained on platform docs + Forlì housing knowledge). Proactive suggestions in chat ("Ask about utilities", "Request a virtual tour"). — *6 days*
- **Success Metrics**: 60%+ of landlords use AI description generator; natural language search used by 30%+ of search sessions; message translation used in 80%+ of cross-language conversations
- **Risks & Mitigations**:
  - *AI hallucination in descriptions* → Always require human review before publishing; inject only verified data (address, price, size) from form fields
  - *API costs* → Use GPT-4o-mini ($0.15/1M input tokens); cache translations; rate limit to 50 generations/user/day

### Feature 5: Semester Calendar & Availability Sync
- **Effort Estimate**: 2 person-weeks
- **Prerequisites**: Notification system (exists), listings (exist)
- **Implementation Phases**:
  1. **Academic calendar data model** (Week 1): `AcademicCalendar` with events: semester start/end, enrollment windows, Er.Go deadlines, exam periods. Listing `availableSemester` field linking to calendar periods. "Available for [semester]" badge on listing cards. — *4 days*
  2. **Timeline UI & alerts** (Week 1–2): Visual timeline component showing housing milestones relative to academic calendar. Student alerts: "Spring semester enrollment opens in 14 days — 23 listings match your criteria." Landlord alerts: "Peak search season starts in 3 weeks — update your listing photos." Semester-based listing freshness ("Updated for Fall 2027"). — *6 days*
- **Success Metrics**: 90%+ of listings tagged with semester availability within 30 days; student engagement increases 40%+ during the 6-week pre-semester window; landlord listing update rate increases 2× around deadline alerts
- **Risks & Mitigations**:
  - *Calendar data accuracy* → Source from official UniBo academic calendar; manual verification; admin can update dates
  - *Alert fatigue* → Limit to 3 calendar-triggered notifications per semester; batch related alerts

### Feature 6: Neighborhood Intelligence Hub
- **Effort Estimate**: 3–4 person-weeks
- **Prerequisites**: Map system (exists), listings data (exists)
- **Implementation Phases**:
  1. **Neighborhood data model** (Week 1): `Neighborhood` model: zone name, description (IT/EN), safety rating (1-5), noise level (quiet/moderate/lively), student density, average rent (computed from listings), amenities list, bus routes. Seed 7 Forlì zones with curated data. — *5 days*
  2. **Neighborhood pages** (Week 2): `/neighborhoods/[zone]` detail pages with: photo gallery, amenity map, average rent chart, listing count, student reviews/tips, bus route info. Neighborhood comparison tool (side-by-side 2-3 zones). — *5 days*
  3. **"Best zone for you" quiz** (Week 3): 5-question quiz: budget, nightlife preference, commute tolerance, shopping needs, quiet study importance. Algorithm maps answers to zone scores. Results page with top 3 recommended zones linking to filtered listings. Integration with onboarding flow. — *4 days*
  4. **Community-contributed tips** (Week 3–4): Students can submit tips/reviews per neighborhood (after verification). Upvote/downvote system. "Living in [zone]" content aggregation. — *3 days*
- **Success Metrics**: 50%+ of new students interact with neighborhood content; quiz completion rate >70% when presented during onboarding; "best zone for you" results in 40%+ click-through to filtered listings
- **Risks & Mitigations**:
  - *Data accuracy for safety/noise ratings* → Start with editorial ratings; allow community calibration over time; add disclaimer
  - *Maintenance of amenity data* → Use Google Places API for POI data; manual curation for student-specific venues

### Feature 7: Document Vault & Compliance Center
- **Effort Estimate**: 3–4 person-weeks
- **Prerequisites**: Production database (Feature 10), lease contracts (exist), payments (exist)
- **Implementation Phases**:
  1. **Document storage** (Week 1): `Document` model: type (lease, ID, enrollment, receipt, tax), file URL, uploaded by, linked entity (lease/payment/user), expiry date. Secure upload to S3/Cloudinary with encryption at rest. Document viewer in dashboard. — *5 days*
  2. **Compliance tracking** (Week 2): Italian rental compliance checklist per lease: registered contract (Agenzia delle Entrate), cedolare secca election, APE (energy certificate), updated catasto. Status tracking with completion percentage. Deadline reminders. — *5 days*
  3. **Tax tools** (Week 3): Cedolare secca calculator: input rent + contract type → annual tax amount + quarterly deadlines. Payment summary for tax declaration (annual export CSV/PDF). Receipt archive with search and filter. — *4 days*
  4. **Template library** (Week 3–4): Downloadable templates: *contratto transitorio*, *disdetta* (termination notice), *inventario* (inventory checklist), *verbale di consegna* (handover report). Pre-filled with platform data where available. — *3 days*
- **Success Metrics**: 80%+ of active leases have associated documents uploaded; 50%+ of landlords use the tax calculator; template downloads >100/month within 6 months
- **Risks & Mitigations**:
  - *Legal liability for tax advice* → Prominent "not legal/tax advice" disclaimers; partner with local *commercialista* for review
  - *Document security* → Encrypt at rest, access audit log, auto-delete after configurable retention period

### Feature 8: Social Proof & Community Feed
- **Effort Estimate**: 2 person-weeks
- **Prerequisites**: Auth (exists), reviews (exist), listings (exist)
- **Implementation Phases**:
  1. **Activity feed** (Week 1): `/community` page with anonymized feed: "A student from SSLMIT found a monolocale in Centro (5 min ago)", "3 new verified listings added this week in Zona Campus". Feed items auto-generated from platform events. Student success stories (opt-in, editorial). — *4 days*
  2. **Social sharing** (Week 1–2): Share listing to WhatsApp/Instagram/copy link with OG meta preview. "Refer a friend" with referral tracking (referrer gets badge). University orientation channel integration (embed listing widgets). — *3 days*
  3. **Content hub** (Week 2): "Student life in Forlì" blog/wiki: moving checklist, residency permit guide (*permesso di soggiorno*), public transport guide, useful phone numbers, emergency contacts. SEO-optimized for "student housing Forlì" long-tail keywords. — *3 days*
- **Success Metrics**: Community feed generates 20%+ of return visits; referral program drives 15%+ of new sign-ups; content hub pages rank in top 10 for "alloggio studenti Forlì" within 6 months
- **Risks & Mitigations**:
  - *Empty feed at launch* → Pre-seed with editorial content + simulated activity; set minimum threshold before showing
  - *Content maintenance* → Recruit 2-3 student ambassadors for content contributions

### Feature 9: Multi-Campus Expansion Framework
- **Effort Estimate**: 4–5 person-weeks
- **Prerequisites**: Production database (Feature 10), neighborhood data (Feature 6)
- **Implementation Phases**:
  1. **Data model refactoring** (Week 1–2): `Campus` entity with: name, university, city, coordinates, neighborhoods. Add `campusId` foreign key to Listing, Neighborhood, AcademicCalendar. Migration script for existing Forlì data. Campus selector in navbar (dropdown or subdomain). — *8 days*
  2. **Cesena expansion** (Week 3): Seed data for Cesena campus (UniBo): 5 neighborhoods, campus coordinates, academic calendar sync. 10 seed listings. Neighborhood content. Bus routes. Cross-campus user accounts (same login, switch campus). — *5 days*
  3. **Ravenna expansion** (Week 4): Same as Cesena. Ravenna campus data. Shared infrastructure, independent content. — *4 days*
  4. **Cross-campus features** (Week 4–5): "Also available in Cesena/Ravenna" suggestions. Cross-campus roommate matching (students who need housing in multiple cities). Unified dashboard for landlords with properties in multiple cities. — *4 days*
- **Success Metrics**: Cesena and Ravenna each reach 30+ listings within 3 months of launch; cross-campus users represent 10%+ of total user base; platform TAM increases from €13.2M to €39.6M addressable rent flow
- **Risks & Mitigations**:
  - *Spreading too thin* → Launch one campus at a time; require 10 seed listings before public launch
  - *Local knowledge gaps* → Recruit student ambassadors at each campus for neighborhood content

### Feature 10: Performance & Reliability Stack
- **Effort Estimate**: 3–4 person-weeks
- **Prerequisites**: None — this unblocks everything else
- **Implementation Phases**:
  1. **Database migration** (Week 1): Expand Prisma schema to match all InMemoryStore models (User, Listing, Conversation, Message, Review, Payment, LeaseContract, Notification, SavedSearch, RoommateProfile). Switch datasource to PostgreSQL (Neon/Supabase free tier). Migration script. Seed script. Replace all `InMemoryStore` imports with Prisma calls. — *5 days*
  2. **Security hardening** (Week 1–2): Replace demo hash with bcrypt. Add CSRF protection. Rate limiting on auth endpoints. Input sanitization with Zod on all server actions. HTTP security headers. Environment variable management with `.env.local` validation. — *4 days*
  3. **Error handling & monitoring** (Week 2–3): React error boundaries at route level. Toast notification system for success/error feedback. Sentry integration for error tracking. Health check endpoint (`/api/health`). Structured logging. — *4 days*
  4. **CI/CD & deployment** (Week 3–4): GitHub Actions: lint + type-check + build on PR. Vercel deployment with preview environments. Automated database migrations on deploy. Lighthouse CI for performance regression. Basic load testing with k6. — *5 days*
- **Success Metrics**: Zero data loss across deployments; p99 page load <2s; error rate <0.1%; deployment from merge to production in <5 minutes; Lighthouse performance score >90
- **Risks & Mitigations**:
  - *Migration data loss* → Develop migration against a copy; test with production-like seed data; maintain InMemoryStore as fallback
  - *Prisma schema drift* → Use `prisma migrate dev --create-only` for review; add schema validation to CI

---

## Part 5: Feature Dependency Graph

```
                    ┌─────────────────────┐
                    │  F10: Performance & │
                    │  Reliability Stack   │
                    └────────┬────────────┘
                             │
              ┌──────────────┼──────────────────┐
              │              │                  │
    ┌─────────▼──────┐  ┌───▼────────────┐  ┌──▼──────────────┐
    │ F2: Admin      │  │ F1: Journey    │  │ F7: Document    │
    │ Dashboard      │  │ Orchestrator   │  │ Vault           │
    └────────────────┘  └───┬────────────┘  └─────────────────┘
                            │
              ┌─────────────┼──────────────┐
              │             │              │
    ┌─────────▼──────┐  ┌──▼───────────┐  │
    │ F3: Onboarding │  │ F4: AI       │  │
    │ Wizard         │  │ Assistant    │  │
    └────────────────┘  └──────────────┘  │
                                          │
    ┌────────────────┐  ┌──────────────┐  │
    │ F5: Semester   │  │ F6: Neighbor-│  │
    │ Calendar       │  │ hood Hub     │──┘
    └────────────────┘  └──────┬───────┘
                               │
                    ┌──────────▼──────────┐
                    │ F9: Multi-Campus    │
                    │ Expansion           │
                    └─────────────────────┘

    Independent: F8 (Social Proof & Community Feed)
```

---

## Part 6: Recommended Implementation Timeline

```
     Phase 1 (Wk 1–4)          Phase 2 (Wk 5–8)          Phase 3 (Wk 9–14)         Phase 4 (Wk 15–20)
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ F10: Prod Stack      │  │ F3: Onboarding       │  │ F1: Journey          │  │ F9: Multi-Campus     │
│ F2: Admin Dashboard  │  │ F4: AI Assistant      │  │ F5: Semester Cal     │  │ F7: Document Vault   │
│ F8: Social Proof     │  │ F6: Neighborhood Hub  │  │                      │  │                      │
│     (parallel)       │  │     (parallel)        │  │                      │  │                      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
    GO LIVE (v1.0)          User Activation           Connected Platform        Regional Expansion
  "It actually works"      "Users find value"        "End-to-end product"     "3× market reach"
```

**Total estimated effort**: 28–38 person-weeks for all 10 features (7–10 months solo, 4–5 months with 2 developers).

**Critical path**: F10 → F2 → F1 → F9 (production → operations → orchestration → scale)

---

## Part 7: Executive Summary

```
┌─────────────────────────────────────────────────────────┐
│ PROJECT VIABILITY SCORECARD (ITERATION 2)               │
├─────────────────────────────────────────────────────────┤
│ Current Market Fit:        [8/10] ████████░░            │
│ Growth Potential:          [9/10] █████████░            │
│ Technical Foundation:      [6/10] ██████░░░░            │
│ Feature Completeness:      [8/10] ████████░░            │
│ Production Readiness:      [2/10] ██░░░░░░░░            │
│ Competitive Position:      [9/10] █████████░            │
├─────────────────────────────────────────────────────────┤
│ OVERALL SCORE:             [7/10] ███████░░░            │
└─────────────────────────────────────────────────────────┘
```

### Score Changes from Iteration 1

| Dimension | Iter 1 | Iter 2 | Δ | Reason |
|-----------|:------:|:------:|:-:|--------|
| Market Fit | 7 | 8 | +1 | 18 features now address both sides of the marketplace comprehensively |
| Growth Potential | 9 | 9 | — | Unchanged — the multi-campus expansion path remains wide open |
| Technical Foundation | 7 | 6 | -1 | More code = more debt. 5.8K LOC with zero tests, no error handling, demo-grade auth |
| Feature Completeness | — | 8 | new | Replaces "Community Health" — measures feature coverage vs. market needs |
| Production Readiness | — | 2 | new | New dimension — the elephant in the room. Nothing runs in production. |
| Competitive Position | 8 | 9 | +1 | Roommate matching + trust scores + digital leases = unmatched feature set for Forlì |

### Bottom Line

**CasaStudente has evolved from a well-architected prototype (Iter 1) to a feature-dense application with 18 capabilities that exceed every competitor in the student housing vertical.** The paradox: the platform has *too many features for its infrastructure*. All 5,871 lines of code run against an in-memory store with a toy hash function and zero tests.

**The single most important next step is Feature 10 (Performance & Reliability Stack)** — specifically, PostgreSQL migration + bcrypt + CI/CD deployment to Vercel. This is 3–4 weeks of unglamorous work that transforms 18 demo features into 18 production features. **Do not build Feature 1–9 until Feature 10 is complete.** After that, the highest-leverage play is Feature 3 (Onboarding Wizard) + Feature 8 (Social Proof) to solve the cold-start problem, then Feature 1 (Journey Orchestrator) to connect the feature silos into a coherent product.

The market window remains open: no digital-first competitor serves Forlì's 4,700 *fuorisede* students. But the gap between "impressive demo" and "launchable product" is 4 weeks of foundation work that cannot be skipped.

---

*Previous analysis: [ANALYSIS.md](./ANALYSIS.md)*
