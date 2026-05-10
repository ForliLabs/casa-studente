# UX Audit — CasaStudente (Iteration 2)

## Scope
Re-reviewed the highest-risk user journeys after iteration 1: listings discovery, listing creation, listing detail/contact, tours, roommates, messaging, lease signing, neighborhood quiz handoff, and admin moderation.

## New findings from iteration 2

### 1. Listings search was still not shareable or recoverable
- Affected: `src/components/listings-browser.tsx`, `src/app/api/listings/route.ts`, `src/lib/listings-search.ts`
- Impact: filters lived only in local UI state, so users could not bookmark, share, or safely refresh a search.
- Fix implemented: search/filter state now lives in URL params, listings API accepts the same filters, sorting is explicit, filter chips are removable, and zero-result searches offer recovery actions.

### 2. Neighborhood quiz did not bridge into discovery
- Affected: `src/app/neighborhoods/quiz/page.tsx`
- Impact: quiz results were interesting but not actionable; users had to start a new search from scratch.
- Fix implemented: result cards now explain the match, preserve budget intent, and deep-link into `/listings` with pre-applied filters.

### 3. Roommate matching still ended in a dead-end CTA
- Affected: `src/app/roommates/page.tsx`, `src/components/roommate-list.tsx`, `src/components/roommate-intro-button.tsx`, `src/app/dashboard/messages/page.tsx`
- Impact: users could see promising profiles but the primary action only bounced them into a generic inbox.
- Fix implemented: profiles now surface match reasons, the CTA starts a real intro conversation, and the inbox can preselect that thread directly.

### 4. Listing detail did not convert tour interest into a real next step
- Affected: `src/app/listings/[id]/page.tsx`, `src/components/tour-request-panel.tsx`, `src/components/image-upload.tsx`
- Impact: virtual-tour availability was mostly decorative and tour requests lacked a clear booking panel.
- Fix implemented: listing detail now shows structured 360-tour context, landlord availability, and a dedicated request panel for guided visit booking.

### 5. Lease workflow looked static instead of progressive
- Affected: `src/app/dashboard/payments/page.tsx`
- Impact: users could see lease data but not understand what happened next or who had to act.
- Fix implemented: the page now shows contract progress steps, signature audit trail, and contextual send/sign actions.

### 6. Listing creation still felt too bare for trust-heavy publishing
- Affected: `src/app/dashboard/listings/new/page.tsx`
- Impact: landlords had little guidance, no photo workflow in-form, and no clear publication-state choice.
- Fix implemented: the flow now includes a publishing checklist, integrated photo upload, photo guidance, and an explicit publication-state control.

### 7. Admin moderation lacked triage context
- Affected: `src/app/admin/moderation/page.tsx`
- Impact: moderators had to inspect raw items without enough summary context to prioritize decisions.
- Fix implemented: the page now surfaces queue summaries and richer moderation context for users, listings, and flagged reviews.

## Outcome
All iteration-2 UX findings above were implemented in code.

## Validation
- `npm run lint` ✅ (warnings only, no errors)
- `npm test` ✅
- `npm run typecheck` ✅
- `npm run build` ✅

## Residual notes
- A few pre-existing ESLint warnings remain in unrelated admin/dashboard modules.
- Build still reports the pre-existing Next.js `middleware` → `proxy` deprecation warning.
