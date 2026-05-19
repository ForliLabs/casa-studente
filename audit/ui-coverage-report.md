# UI Coverage Audit — CasaStudente

## Executive summary

- Audited **55** product-facing capabilities across discovery, account, communication, trust, operations, experience, and admin/labs.
- Coverage snapshot: **43 covered**, **3 partial**, **3 missing**, **6 hidden**.
- Highest-risk gaps before remediation: saved-search creation is absent from listings, the AI listing assistant is implemented but invisible, shared navigation underserves admins/utilities/status, and listing detail under-links adjacent journeys.
- Build baseline: `npm run build` passed; `npm test` passed; `npm run lint` exits non-zero on pre-existing warnings.
- Post-implementation counters will be finalized in the cleanup pass at the end of this run.

## Phase 1 — Feature Inventory

### Discovery
1. Home landing and value proposition — Marketing homepage, hero CTA, pricing and feature sections.
2. Listings browser and structured filters — Public listings page with URL-backed filters, chips, sort, mobile panel and empty-state support.
3. Natural-language housing search — Listings browser includes NL search input with AI/fallback parsing.
4. Saved-search creation from discovery — Server action exists, notifications page references the capability, but listings UI has no create flow.
5. Favorites and compare workflow — Favorite buttons plus compare page and share/export tools are reachable from listing flows.
6. Listing detail experience — Rich detail page with landlord card, contact, reviews, tour request and quick actions.
7. Monthly cost calculator — Listing detail surfaces a dedicated monthly cost estimator.
8. Interactive map and campus distance — Listings and single-listing maps visualize relative position to campus.
9. Neighborhood guides — Dedicated neighborhood index and zone detail pages.
10. Neighborhood quiz handoff — Quiz page deep-links into listings with pre-applied criteria.
11. Academic calendar — Standalone calendar page for semester milestones.
12. PWA install, offline fallback, and manifest shortcuts — Manifest, install prompt, offline page, and web app metadata are present.

### Account
13. Registration — Dedicated register flow with password-strength hints and role selection.
14. Login and logout — Dedicated login form plus logout route wired into menus.
15. University verification — Verification page supports matricola entry and optional file upload.
16. Guided onboarding wizard — Auth flows redirect incomplete users into a role-based onboarding wizard.
17. Language switching and locale persistence — Locale switcher exists, but much of the UI copy remains hard-coded Italian.
18. Account shortcuts and utility navigation — User menu exists but hides several high-value destinations and role-specific entries.

### Communication
19. Listing contact flow — Contact form creates a real conversation and notification.
20. Messaging inbox — Dashboard inbox supports unread counts, optimistic send and mobile thread switching.
21. Tour requests and booking flow — Listing detail exposes tour request panel and dashboard follow-up.
22. Roommate directory and compatibility scoring — Roommates index shows profiles, compatibility and intro CTA.
23. Roommate profile editor — Dedicated profile creation/editing route.
24. Search together — Roommate group search panel builds combined listing queries.
25. AI message translation — Server action exists but no UI exposes translation inside messaging.
26. AI housing assistant chat — Server action/service exists but no route or component usage exposes chat.

### Trust
27. Reviews and trust badges — Public reviews page and listing trust indicators are visible.
28. Notifications center — Notifications page supports read state and links to related items.
29. Saved-search management — Notifications page lists and deletes saved searches once created.
30. Contact support — Contact page exists, but delivery stays in demo/mock mode.
31. Platform status and health checks — Dedicated status page and health endpoint exist, but no primary discoverability path.

### Operations
32. Dashboard overview — Role-aware overview with quick actions, stats and activity feed.
33. Listing management dashboard — Landlord/admin listing management with status toggles and delete actions.
34. Listing creation flow — Dedicated publish form with media upload and publication state.
35. AI listing description assistant — Reusable AI description component exists but is not mounted in the publish flow.
36. Payments dashboard — Payments page is available from dashboard navigation.
37. Document vault — Documents page exists in the dashboard nav.
38. Journey tracking — Student journey page is reachable from dashboard navigation.
39. Compliance center — Compliance dashboard page is reachable for landlord/admin flows.
40. Legal compliance wizard — Dedicated legal-compliance page is exposed in landlord navigation.
41. Tenant score — Tenant score page is exposed in landlord navigation.
42. Insurance — Insurance page is exposed in landlord navigation.
43. Disputes and mediation — Disputes page is exposed in landlord navigation.
44. Pricing engine — Pricing page is exposed in landlord navigation.
45. Insights analytics — Insights page is exposed in landlord navigation.
46. Forecasting — Forecasting page is exposed in landlord navigation.
47. Landlord API explorer — Landlord API page is exposed in landlord navigation.

### Experience
48. Accessibility settings — Accessibility page is exposed in dashboard navigation.
49. University SSO — University SSO page is exposed in student/admin navigation.
50. Housing groups — Groups page is exposed in student/admin navigation.
51. Community feed — Public community page exists in top navigation.

### Admin
52. Admin console shell — Admin layout and landing page are role-gated but lack top-level entry for admins.
53. Admin operations pages — Users, moderation, analytics, marketplace and telemetry live behind direct admin shell only.
54. Moonshots hub — Moonshot pages exist but are only discoverable deep in dashboard landlord labs.
55. Multi-campus selector — Campus selector component and campus store exist but no page mounts them.

## Phase 2 — UI Coverage Mapping

| # | Feature | Domain | UI Status | Notes |
| --- | --- | --- | --- | --- |
| 1 | Home landing and value proposition | Discovery | [COVERED] | Marketing homepage, hero CTA, pricing and feature sections. |
| 2 | Listings browser and structured filters | Discovery | [COVERED] | Public listings page with URL-backed filters, chips, sort, mobile panel and empty-state support. |
| 3 | Natural-language housing search | Discovery | [COVERED] | Listings browser includes NL search input with AI/fallback parsing. |
| 4 | Saved-search creation from discovery | Discovery | [MISSING] | Server action exists, notifications page references the capability, but listings UI has no create flow. |
| 5 | Favorites and compare workflow | Discovery | [COVERED] | Favorite buttons plus compare page and share/export tools are reachable from listing flows. |
| 6 | Listing detail experience | Discovery | [COVERED] | Rich detail page with landlord card, contact, reviews, tour request and quick actions. |
| 7 | Monthly cost calculator | Discovery | [COVERED] | Listing detail surfaces a dedicated monthly cost estimator. |
| 8 | Interactive map and campus distance | Discovery | [COVERED] | Listings and single-listing maps visualize relative position to campus. |
| 9 | Neighborhood guides | Discovery | [COVERED] | Dedicated neighborhood index and zone detail pages. |
| 10 | Neighborhood quiz handoff | Discovery | [COVERED] | Quiz page deep-links into listings with pre-applied criteria. |
| 11 | Academic calendar | Discovery | [COVERED] | Standalone calendar page for semester milestones. |
| 12 | PWA install, offline fallback, and manifest shortcuts | Discovery | [COVERED] | Manifest, install prompt, offline page, and web app metadata are present. |
| 13 | Registration | Account | [COVERED] | Dedicated register flow with password-strength hints and role selection. |
| 14 | Login and logout | Account | [COVERED] | Dedicated login form plus logout route wired into menus. |
| 15 | University verification | Account | [COVERED] | Verification page supports matricola entry and optional file upload. |
| 16 | Guided onboarding wizard | Account | [COVERED] | Auth flows redirect incomplete users into a role-based onboarding wizard. |
| 17 | Language switching and locale persistence | Account | [PARTIAL] | Locale switcher exists, but much of the UI copy remains hard-coded Italian. |
| 18 | Account shortcuts and utility navigation | Account | [PARTIAL] | User menu exists but hides several high-value destinations and role-specific entries. |
| 19 | Listing contact flow | Communication | [COVERED] | Contact form creates a real conversation and notification. |
| 20 | Messaging inbox | Communication | [COVERED] | Dashboard inbox supports unread counts, optimistic send and mobile thread switching. |
| 21 | Tour requests and booking flow | Communication | [COVERED] | Listing detail exposes tour request panel and dashboard follow-up. |
| 22 | Roommate directory and compatibility scoring | Communication | [COVERED] | Roommates index shows profiles, compatibility and intro CTA. |
| 23 | Roommate profile editor | Communication | [COVERED] | Dedicated profile creation/editing route. |
| 24 | Search together | Communication | [COVERED] | Roommate group search panel builds combined listing queries. |
| 25 | AI message translation | Communication | [MISSING] | Server action exists but no UI exposes translation inside messaging. |
| 26 | AI housing assistant chat | Communication | [MISSING] | Server action/service exists but no route or component usage exposes chat. |
| 27 | Reviews and trust badges | Trust | [COVERED] | Public reviews page and listing trust indicators are visible. |
| 28 | Notifications center | Trust | [COVERED] | Notifications page supports read state and links to related items. |
| 29 | Saved-search management | Trust | [COVERED] | Notifications page lists and deletes saved searches once created. |
| 30 | Contact support | Trust | [PARTIAL] | Contact page exists, but delivery stays in demo/mock mode. |
| 31 | Platform status and health checks | Trust | [HIDDEN] | Dedicated status page and health endpoint exist, but no primary discoverability path. |
| 32 | Dashboard overview | Operations | [COVERED] | Role-aware overview with quick actions, stats and activity feed. |
| 33 | Listing management dashboard | Operations | [COVERED] | Landlord/admin listing management with status toggles and delete actions. |
| 34 | Listing creation flow | Operations | [COVERED] | Dedicated publish form with media upload and publication state. |
| 35 | AI listing description assistant | Operations | [HIDDEN] | Reusable AI description component exists but is not mounted in the publish flow. |
| 36 | Payments dashboard | Operations | [COVERED] | Payments page is available from dashboard navigation. |
| 37 | Document vault | Operations | [COVERED] | Documents page exists in the dashboard nav. |
| 38 | Journey tracking | Operations | [COVERED] | Student journey page is reachable from dashboard navigation. |
| 39 | Compliance center | Operations | [COVERED] | Compliance dashboard page is reachable for landlord/admin flows. |
| 40 | Legal compliance wizard | Operations | [COVERED] | Dedicated legal-compliance page is exposed in landlord navigation. |
| 41 | Tenant score | Operations | [COVERED] | Tenant score page is exposed in landlord navigation. |
| 42 | Insurance | Operations | [COVERED] | Insurance page is exposed in landlord navigation. |
| 43 | Disputes and mediation | Operations | [COVERED] | Disputes page is exposed in landlord navigation. |
| 44 | Pricing engine | Operations | [COVERED] | Pricing page is exposed in landlord navigation. |
| 45 | Insights analytics | Operations | [COVERED] | Insights page is exposed in landlord navigation. |
| 46 | Forecasting | Operations | [COVERED] | Forecasting page is exposed in landlord navigation. |
| 47 | Landlord API explorer | Operations | [COVERED] | Landlord API page is exposed in landlord navigation. |
| 48 | Accessibility settings | Experience | [COVERED] | Accessibility page is exposed in dashboard navigation. |
| 49 | University SSO | Experience | [COVERED] | University SSO page is exposed in student/admin navigation. |
| 50 | Housing groups | Experience | [COVERED] | Groups page is exposed in student/admin navigation. |
| 51 | Community feed | Experience | [COVERED] | Public community page exists in top navigation. |
| 52 | Admin console shell | Admin | [HIDDEN] | Admin layout and landing page are role-gated but lack top-level entry for admins. |
| 53 | Admin operations pages | Admin | [HIDDEN] | Users, moderation, analytics, marketplace and telemetry live behind direct admin shell only. |
| 54 | Moonshots hub | Admin | [HIDDEN] | Moonshot pages exist but are only discoverable deep in dashboard landlord labs. |
| 55 | Multi-campus selector | Admin | [HIDDEN] | Campus selector component and campus store exist but no page mounts them. |

## Phase 3 — UX Quality Assessment

_Only items with material violations are listed below; covered items without findings passed the discoverability/feedback/consistency/accessibility/edge-case review._

**#4 — Saved-search creation from discovery** `[CRITICAL]`
- Criterion violated: Feedback
- Specific problem: The product promises saved-search alerts, has a server action, and references the capability in notifications, but users cannot create one from the listings experience.
- Location in codebase: src/components/listings-browser.tsx; src/lib/actions/notifications.ts; src/app/notifications/page.tsx

**#35 — AI listing description assistant** `[MAJOR]`
- Criterion violated: Feedback
- Specific problem: The AI listing description assistant is implemented but not wired into the landlord publish flow, leaving a productivity feature unused.
- Location in codebase: src/components/ai-assistant.tsx; src/app/dashboard/listings/new/page.tsx

**#1 — Home landing and value proposition** `[MAJOR]`
- Criterion violated: Discoverability
- Specific problem: Guest-facing homepage promotes a dashboard CTA that routes through auth without saying so.
- Location in codebase: src/app/page.tsx

**#18 — Account shortcuts and utility navigation** `[MAJOR]`
- Criterion violated: Discoverability
- Specific problem: Authenticated navigation omits key utility destinations and role-specific shortcuts, especially for admins and for product pages like status/reviews.
- Location in codebase: src/components/user-menu.tsx; src/components/navbar.tsx

**#52 — Admin console shell** `[MAJOR]`
- Criterion violated: Discoverability
- Specific problem: Admins have no obvious primary entry into the admin console from shared navigation.
- Location in codebase: src/components/user-menu.tsx; src/components/navbar.tsx; src/app/admin/layout.tsx

**#31 — Platform status and health checks** `[MAJOR]`
- Criterion violated: Discoverability
- Specific problem: The platform status page is implemented but effectively hidden unless users know the URL.
- Location in codebase: src/app/status/page.tsx; src/components/footer.tsx; src/components/user-menu.tsx

**#6 — Listing detail experience** `[MAJOR]`
- Criterion violated: Discoverability
- Specific problem: Listing detail exposes rich actions, but it does not connect users onward to adjacent discovery tools such as neighborhood guidance, roommate matching, or next-step guidance.
- Location in codebase: src/app/listings/[id]/page.tsx

**#30 — Contact support** `[MINOR]`
- Criterion violated: Feedback
- Specific problem: The support form succeeds in UI terms but still announces demo-mode delivery, which weakens trust for a core support path.
- Location in codebase: src/components/general-contact-form.tsx; src/lib/actions/messages.ts

**#53 — Admin operations pages** `[MINOR]`
- Criterion violated: Discoverability
- Specific problem: Admin subpages inherit the hidden-shell issue and remain invisible outside direct URLs.
- Location in codebase: src/app/admin/layout.tsx

**#17 — Language switching and locale persistence** `[MINOR]`
- Criterion violated: Consistency
- Specific problem: Locale switching is available, but large portions of the interface remain hard-coded Italian, so the control over-promises global coverage.
- Location in codebase: src/components/language-switcher.tsx; multiple src/app pages

**#25 — AI message translation** `[MINOR]`
- Criterion violated: Edge cases
- Specific problem: Messaging claims AI-powered translation in the codebase, but the inbox has no affordance for multilingual recipients.
- Location in codebase: src/lib/actions/ai.ts; src/components/messages-view.tsx

**#26 — AI housing assistant chat** `[MINOR]`
- Criterion violated: Discoverability
- Specific problem: The housing assistant/chat capability exists only in services and actions, with no route or launcher for users.
- Location in codebase: src/lib/actions/ai.ts; src/lib/services/ai.ts

**#54 — Moonshots hub** `[MINOR]`
- Criterion violated: Discoverability
- Specific problem: Moonshots are only available deep in landlord labs, which is acceptable for experiments but effectively hides them from curious evaluators.
- Location in codebase: src/app/dashboard/layout.tsx; src/app/dashboard/moonshots/page.tsx

**#55 — Multi-campus selector** `[MINOR]`
- Criterion violated: Discoverability
- Specific problem: The campus selector and multi-campus store exist as a dormant capability with no mounted UI.
- Location in codebase: src/components/campus-selector.tsx; src/lib/stores/campus.ts

## Phase 4 — Remediation Plan

**#4 — Saved-search creation from discovery**
- What to fix: Add a save-search entry point directly in listings discovery, with auth-aware messaging, current-filter capture, and success feedback.
- Where: src/components/listings-browser.tsx; src/lib/actions/notifications.ts; src/app/notifications/page.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [S]

**#35 — AI listing description assistant**
- What to fix: Embed the assistant in listing creation and support applying generated copy into the description field.
- Where: src/components/ai-assistant.tsx; src/app/dashboard/listings/new/page.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [S]

**#1 — Home landing and value proposition**
- What to fix: Make the secondary CTA auth-aware so guests see an explicit login handoff while signed-in users keep the dashboard shortcut.
- Where: src/app/page.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [XS]

**#18 — Account shortcuts and utility navigation**
- What to fix: Expand the user menu/mobile account section with utility links, admin entry points, and better role-aware shortcuts.
- Where: src/components/user-menu.tsx; src/components/navbar.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [XS]

**#52 — Admin console shell**
- What to fix: Expose an admin-only entry from account navigation and mobile account actions.
- Where: src/components/user-menu.tsx; src/components/navbar.tsx; src/app/admin/layout.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [XS]

**#31 — Platform status and health checks**
- What to fix: Add lightweight discoverability from utility navigation and footer support links.
- Where: src/app/status/page.tsx; src/components/footer.tsx; src/components/user-menu.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [XS]

**#6 — Listing detail experience**
- What to fix: Add a compact next-step panel that cross-links into the most relevant adjacent journeys based on context.
- Where: src/app/listings/[id]/page.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [S]

**#30 — Contact support**
- What to fix: Route submissions through the email service when configured and present honest fallback copy when not configured.
- Where: src/components/general-contact-form.tsx; src/lib/actions/messages.ts
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [S]

**#53 — Admin operations pages**
- What to fix: Once the admin console is surfaced, its subpages inherit discoverability through the existing side nav.
- Where: src/app/admin/layout.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [XS]

**#17 — Language switching and locale persistence**
- What to fix: Incrementally localize the highest-traffic page copy or relabel the control as locale preference where full translations are unavailable.
- Where: src/components/language-switcher.tsx; multiple src/app pages
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [L]

**#25 — AI message translation**
- What to fix: Add per-message translation affordances in the inbox when multilingual use cases matter.
- Where: src/lib/actions/ai.ts; src/components/messages-view.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [M]

**#26 — AI housing assistant chat**
- What to fix: Expose the assistant from a visible page or defer and remove product claims until launched.
- Where: src/lib/actions/ai.ts; src/lib/services/ai.ts
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [M]

**#54 — Moonshots hub**
- What to fix: Keep them in labs but add context text or a visible labs entry where appropriate.
- Where: src/app/dashboard/layout.tsx; src/app/dashboard/moonshots/page.tsx
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [S]

**#55 — Multi-campus selector**
- What to fix: Either mount the selector in a meaningful discovery surface or defer and document it as dormant.
- Where: src/components/campus-selector.tsx; src/lib/stores/campus.ts
- Recommended pattern: Keep the change inside the current route/component flow, use existing Tailwind/UI primitives, and prefer progressive disclosure over new standalone pages unless the capability is genuinely missing.
- Effort: [S]

## Phase 5 — Priority Stack Rank

### Ranked remediation backlog

| Rank | # | Feature | Domain | Status | Severity | Effort | Why now |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 4 | Saved-search creation from discovery | Discovery | [MISSING] | [CRITICAL] | [S] | Core flow blocker |
| 2 | 35 | AI listing description assistant | Operations | [HIDDEN] | [MAJOR] | [S] | Fast discoverability win |
| 3 | 1 | Home landing and value proposition | Discovery | [COVERED] | [MAJOR] | [XS] | Fast discoverability win |
| 4 | 18 | Account shortcuts and utility navigation | Account | [PARTIAL] | [MAJOR] | [XS] | Fast discoverability win |
| 5 | 52 | Admin console shell | Admin | [HIDDEN] | [MAJOR] | [XS] | Fast discoverability win |
| 6 | 31 | Platform status and health checks | Trust | [HIDDEN] | [MAJOR] | [XS] | Fast discoverability win |
| 7 | 6 | Listing detail experience | Discovery | [COVERED] | [MAJOR] | [S] | Secondary UX debt |
| 8 | 30 | Contact support | Trust | [PARTIAL] | [MINOR] | [S] | Secondary UX debt |
| 9 | 53 | Admin operations pages | Admin | [HIDDEN] | [MINOR] | [XS] | Secondary UX debt |
| 10 | 17 | Language switching and locale persistence | Account | [PARTIAL] | [MINOR] | [L] | Secondary UX debt |
| 11 | 25 | AI message translation | Communication | [MISSING] | [MINOR] | [M] | Secondary UX debt |
| 12 | 26 | AI housing assistant chat | Communication | [MISSING] | [MINOR] | [M] | Secondary UX debt |
| 13 | 54 | Moonshots hub | Admin | [HIDDEN] | [MINOR] | [S] | Secondary UX debt |
| 14 | 55 | Multi-campus selector | Admin | [HIDDEN] | [MINOR] | [S] | Secondary UX debt |

### Top 5 Quick Wins

| Rank | # | Feature | Severity | Effort | Expected UX gain |
| --- | --- | --- | --- | --- | --- |
| 1 | 4 | Saved-search creation from discovery | [CRITICAL] | [S] | Unlocks alerts from the main search journey |
| 2 | 35 | AI listing description assistant | [MAJOR] | [S] | Turns a dormant productivity feature into a visible landlord tool |
| 3 | 1 | Home landing and value proposition | [MAJOR] | [XS] | Removes CTA ambiguity on the first screen |
| 4 | 18 | Account shortcuts and utility navigation | [MAJOR] | [XS] | Improves day-to-day navigation for authenticated users |
| 5 | 52 | Admin console shell | [MAJOR] | [XS] | Gives admins a direct path into their console |

### Deferred items

- To be updated after implementation with explicit implemented/deferred counts and any items intentionally left for follow-up.
