# Depth Audit — CasaStudente (Iteration 2)

## Scope
Re-audited API consistency, server-action correctness, authorization boundaries, workflow truthfulness, test coverage for new helpers, and build integrity after the first depth pass.

## Findings from iteration 2

### 1. Listings filtering logic was duplicated across UI and API
- Evidence: browse UX and `/api/listings` previously did not share a single parser/filter/sort path.
- Risk: inconsistent results between pages, refreshes, and programmatic consumers.
- Fix implemented: `src/lib/listings-search.ts` centralizes parsing/filtering/sorting and is used by both the browser UI and listings API.

### 2. Public listing and landlord API payloads were still inconsistent
- Evidence: endpoints mixed raw arrays, ad-hoc objects, `Response.json`, and `NextResponse` payload shapes.
- Risk: fragile clients, unclear error handling, and inconsistent API contracts.
- Fix implemented: `src/lib/api-response.ts` now provides shared success/error envelopes and the updated listings + landlord routes use that contract.

### 3. Roommate intro and inbox flows were not fully account-scoped
- Evidence: roommate CTA did not create a real conversation and the messages dashboard could expose non-user-specific threads.
- Risk: shallow product behavior and privacy leakage across accounts.
- Fix implemented: intro flow now creates real conversations through `startConversationAction`, the inbox requires auth, filters by current participant, and aligns bubbles using the real current user.

### 4. Lease signing looked complete in UI but lacked workflow enforcement
- Evidence: leases had display-only status with no participant permissions, sequencing, or audit trail.
- Risk: contracts could appear signed or actionable without a truthful state machine.
- Fix implemented: `src/lib/lease-workflow.ts` and `src/lib/actions/payments.ts` now validate date order, enforce send/sign permissions, persist signature timestamps/audit trail, and expose progressive UI actions in the payments dashboard.

### 5. Tour requests trusted client-provided context too much
- Evidence: request flow relied on hidden form data and weak action validation.
- Risk: invalid dates, self-booking, or mismatched landlord/listing data could slip through.
- Fix implemented: `src/lib/actions/tours.ts` and `src/lib/tour-workflow.ts` now reload real listing/landlord data, require future slots, and enforce request/confirm/complete/cancel permissions.

### 6. New helper modules had no direct unit coverage
- Evidence: iteration-2 helpers were introduced for API envelopes, listings search, lease workflow, and tour workflow.
- Risk: regressions in shared logic would be easy to miss.
- Fix implemented: added unit tests in `tests/unit/api-response.test.ts`, `tests/unit/listings-search.test.ts`, `tests/unit/lease-workflow.test.ts`, and `tests/unit/tour-workflow.test.ts`.

## Outcome
All iteration-2 depth findings above were fixed in code and revalidated.

## Validation
- `npm run lint` ✅ (warnings only, no errors)
- `npm test` ✅ (`139` tests passing)
- `npm run typecheck` ✅
- `npm run build` ✅

## Residual notes
- The app still relies on in-memory demo stores, so workflow truth is session-local rather than durable.
- Build still surfaces the pre-existing Next.js `middleware` → `proxy` deprecation warning.
