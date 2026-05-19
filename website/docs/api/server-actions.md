---
sidebar_position: 2
title: Server Actions
description: The primary mutation API, called from forms and useActionState.
---

# Server Actions

CasaStudente prefers **Server Actions** over REST for mutations. They’re strongly typed, share the same auth context as the page, and avoid an extra network hop. Every action lives in `src/lib/actions/**` and is grouped by domain.

## Calling a Server Action

From a Server Component:

```tsx
import { createListingAction } from '@/lib/actions/listings';

export default function NewListingPage() {
  return (
    <form action={createListingAction}>
      <input name="title" required />
      <input name="price" type="number" required />
      <button type="submit">Publish</button>
    </form>
  );
}
```

From a Client Component, use React 19's `useActionState`:

```tsx
'use client';
import { useActionState } from 'react';
import { createListingAction } from '@/lib/actions/listings';

export function NewListingForm() {
  const [state, formAction, pending] = useActionState(createListingAction, { ok: false });
  return (
    <form action={formAction}>
      {/* fields */}
      <button disabled={pending}>{pending ? 'Saving…' : 'Publish'}</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
```

Every action returns a `FormState` shape:

```ts
type FormState<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string; field?: string };
```

## Authentication actions

| Action | Description |
| ------ | ----------- |
| `register` | Create account. Sends verification email. |
| `login` | Verify password, set session cookie. |
| `logout` | Equivalent to `POST /api/auth/logout`. |
| `verifyEmail` | Consume a one-time token. |
| `requestPasswordReset` | Email a reset link. |
| `resetPassword` | Consume reset token, set new password. |
| `updateProfile` | Edit name, avatar, locale. |

File: `src/lib/actions/auth.ts`.

## Listing actions

| Action | Description |
| ------ | ----------- |
| `createListing` | Landlord-only. Validates against listing limits. |
| `updateListing` | Owner or admin. |
| `archiveListing` | Soft delete. |
| `saveSearch` | Persist filter as `SavedSearch`. |
| `removeSavedSearch` | Delete a saved search. |
| `requestVerification` | Submit a listing for moderation. |

File: `src/lib/actions/listings.ts`.

## Messaging actions

| Action | Description |
| ------ | ----------- |
| `startConversation` | Listing-scoped thread. |
| `sendMessage` | Rate-limited, translated. |
| `markRead` | Decrement unread count. |
| `reportThread` | Push to moderation queue. |

File: `src/lib/actions/messaging.ts`.

## Payment actions

| Action | Description |
| ------ | ----------- |
| `createCheckout` | Returns a Stripe Checkout URL (mock or real). |
| `cancelSubscription` | Stops monthly rent (with co-signer). |
| `refundPayment` | Admin-only. Audits reason. |
| `connectLandlord` | Returns Stripe Connect onboarding URL. |

File: `src/lib/actions/payments.ts`.

## Review actions

| Action | Description |
| ------ | ----------- |
| `submitReview` | Requires verified lease between reviewer and reviewee. |
| `editReview` | Within 14 days of submission. |
| `flagReview` | Push to moderation. |

File: `src/lib/actions/reviews.ts`.

## Notification actions

| Action | Description |
| ------ | ----------- |
| `markAllRead` | Mark every notification read. |
| `updatePreferences` | Per-channel toggles. |

File: `src/lib/actions/notifications.ts`.

## AI actions

| Action | Description |
| ------ | ----------- |
| `parseSearch` | NL → `ListingFilter`. |
| `generateDescription` | Listing copy in N locales. |
| `translateMessage` | Single-message translation. |

File: `src/lib/actions/ai.ts`. See [Guides → AI Features](../guides/ai-features).

## Onboarding actions

| Action | Description |
| ------ | ----------- |
| `submitRoommateProfile` | Stores compatibility inputs. |
| `completeOnboarding` | Flips `User.onboardingComplete`. |

File: `src/lib/actions/onboarding.ts`.

## Additional modules

The full list (29 modules) also includes: `admin`, `disputes`, `documents`, `housingGroups`, `insurance`, `journey`, `leases`, `maintenance`, `moonshots`, `roommates`, `tenantScore`, `tourBookings`, `university`. Each follows the same `FormState` convention.

## Validation

Every action validates inputs through a Zod schema in `src/lib/validation.ts`. Invalid input never reaches the data layer; the action returns `{ ok: false, error, field }`.

## Auth and authorisation

Every action that mutates state calls `requireSession()` and, when role-specific, `requireRole('student' | 'landlord' | 'admin')`. Anonymous mutations are rejected with `{ ok: false, error: 'unauthorized' }`.
