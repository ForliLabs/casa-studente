# Depth Audit — CasaStudente

## Scope
Reviewed server actions, auth/session flows, landlord API routes, notifications, listings mutations, onboarding, messaging, reviews, and payment flows in the current Next.js app. The goal was to identify features that looked complete in UI but were shallow, insecure, or disconnected from real product state.

## Findings

### 🔴 Critical

1. **Landlord contact flow was fake in practice**  
   - Evidence: listing contact UI previously ended in optimistic client-only feedback; messaging state was not reliably created.  
   - Risk: users think they contacted a landlord when no conversation exists.  
   - Fix implemented: `src/lib/actions/messages.ts`, `src/components/contact-form.tsx`, and `src/app/listings/[id]/page.tsx` now create or update real conversations/messages, notify the landlord, and route users toward the messages dashboard.

2. **Landlord API routes returned hardcoded demo payloads without auth**  
   - Evidence: `src/app/api/landlord/{analytics,inquiries,listings}/route.ts` returned static arrays/objects.  
   - Risk: private landlord endpoints exposed fake data and ignored account scope.  
   - Fix implemented: all three routes now require an authenticated landlord/admin and derive data from live in-memory stores (`listingStore`, `conversationStore`, `messageStore`, `paymentStore`).

3. **Listing mutations lacked ownership enforcement**  
   - Evidence: `src/lib/actions/listings.ts` allowed update/delete/status changes after only a loose auth check.  
   - Risk: one landlord could mutate another landlord’s listings.  
   - Fix implemented: create/update/delete/status actions now validate current user role, check ownership via landlord email, and use schema-backed creation parsing.

4. **Notifications could leak another user’s data**  
   - Evidence: `src/app/notifications/page.tsx` fell back to `user-student-1` when no user existed; notification/saved-search mutations had weak ownership checks.  
   - Risk: anonymous users could see demo notifications or mutate another user’s saved items.  
   - Fix implemented: notifications page now redirects unauthenticated users to login, and notification/saved-search actions verify authenticated ownership before mutating.

5. **Payments were recorded as completed immediately with no truthful state**  
   - Evidence: `src/lib/actions/payments.ts` created successful payments directly in `completed` state.  
   - Risk: finance UI could claim money was processed before any provider confirmation.  
   - Fix implemented: payments are now created in `pending`, tied to the real landlord behind the listing, and the dashboard explains pending/manual confirmation status.

### 🟡 Important

6. **Onboarding steps were mostly placeholders**  
   - Evidence: `src/components/onboarding-wizard.tsx` and `src/lib/actions/onboarding.ts` had placeholder fields and no meaningful persistence for student or landlord setup.  
   - Risk: activation funnel looked polished but did not save usable state.  
   - Fix implemented: onboarding now captures real student preferences + saved search data, and landlord onboarding creates the first live listing instead of ending in a dead-end wizard.

7. **University verification persisted shallowly in UI**  
   - Evidence: verify screen accepted a file name string instead of a file input and only weakly reflected success.  
   - Risk: verification looked fake and low-trust.  
   - Fix implemented: `src/app/auth/verify/page.tsx` now supports real file input UX and toast feedback; `src/lib/actions/auth.ts` persists university metadata and verification state.

8. **Dashboard listing management was disconnected from live data**  
   - Evidence: `src/app/dashboard/listings/page.tsx` rendered `landlordListings` demo data instead of the real store used by listing creation.  
   - Risk: landlords could publish an announcement and not see it in their own dashboard.  
   - Fix implemented: dashboard listings now render from `listingStore`, scope by owner, show real inquiry counts, and mutate the same underlying records.

9. **Payments and leases pages exposed global data instead of account-scoped data**  
   - Evidence: `src/app/dashboard/payments/page.tsx` loaded every payment and lease in the store.  
   - Risk: students and landlords could see unrelated financial records.  
   - Fix implemented: the dashboard payments page now filters by current user (payer, recipient, or admin) before rendering summaries and tables.

10. **Review creation and reporting only partially validated input/auth**  
    - Evidence: `src/lib/actions/reviews.ts` hand-rolled validation and allowed review flagging without auth.  
    - Risk: inconsistent server validation and untrusted moderation actions.  
    - Fix implemented: review submission now uses `createReviewSchema`, and flagging requires an authenticated user.

11. **Password module still contained lint-breaking legacy `require()` usage**  
    - Evidence: `src/lib/password.ts` used `require("crypto")` inside the legacy verifier.  
    - Risk: broken lint baseline and inconsistent module style in a security-sensitive file.  
    - Fix implemented: crypto imports are now ESM-only while preserving backward-compatible hash verification.

## Outcome
- All 🔴 and 🟡 findings above were fixed in code.
- UX fixes and depth fixes now share the same underlying product state rather than isolated demo shells.
- Validation status at completion:
  - `npm run lint` ✅ (warnings only, no errors)
  - `npm run typecheck` ✅
  - `npm test` ✅
  - `npm run build` ✅

## Residual notes
- The project still has several pre-existing ESLint warnings in unrelated admin/dashboard modules.
- Next.js also reports a pre-existing middleware deprecation warning (`middleware` → `proxy`) during build. These did not block the requested deliverables or the successful production build.
