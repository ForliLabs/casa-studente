---
sidebar_position: 1
title: Student Quickstart
description: From sign-up to signed lease in ten minutes.
---

# Student Quickstart

This guide walks you through the full student journey on CasaStudente: account → verification → search → message → tour → lease → payment. You can follow it on a fresh local install with the seeded demo accounts.

## 1. Create your account

Visit `/auth/register` and sign up with your university email. Using an `@studio.unibo.it` address grants automatic university verification.

```bash
# On a fresh install, you can log in with the seeded student instead:
Email:    martina.lopez@studio.unibo.it
Password: password123
```

## 2. Complete the roommate profile

Head to `/onboarding`. You’ll answer five short questions:

- Monthly budget (€)
- Sleep schedule (early bird / night owl)
- Cleanliness (relaxed / tidy / immaculate)
- Social style (introvert / balanced / extrovert)
- Languages spoken

These power the compatibility algorithm — see **[Roommate matching](./roommate-matching)** for the math.

## 3. Search for a room

Three ways to find listings:

```ts
// 1. Faceted URL — bookmarkable, shareable
'/listings?zone=Campus&priceMax=400&type=stanza singola'

// 2. Natural-language box in the navbar
'singola luminosa entro 400€ vicino al Campus, possibilmente con balcone'

// 3. The map view on /listings/map
```

Save your filter as a Saved Search to receive an email whenever a new matching listing appears.

## 4. Open a thread

Click **Contact landlord** on any listing. This creates a `Conversation` scoped to that listing. Your message is automatically translated to the landlord’s preferred locale if it differs from yours — the original is always one click away.

:::tip
New accounts can DM up to 3 unique landlords before email verification. Confirm your email to unlock unlimited messaging.
:::

## 5. Book a tour (optional)

If the listing offers tours, the **Book tour** button on the listing page opens the tour calendar. Pick a slot, and the landlord is notified. Virtual tours are conducted via the in-app video link.

## 6. Sign the lease

When you and the landlord agree, the landlord drafts a lease in the dashboard. You’ll receive a notification and a link to:

1. Review the lease (type, duration, deposit, monthly rent, included utilities).
2. Verify your details (auto-filled from your profile).
3. Digitally sign — the platform stores a hashed signature on the `LeaseContract`.

Lease types supported: `transitorio` (recommended for students), `4+4`, `3+2`.

## 7. Pay first month + deposit

Stripe Checkout opens after signing. Supported methods:

- Card (Visa / Mastercard / Amex)
- Satispay
- SEPA direct debit (for recurring rent)

The first checkout collects the deposit plus the first month's rent plus the 5% platform fee. Subsequent months auto-charge as a Stripe subscription.

In local dev, Stripe runs in **mock mode** by default — see [Stripe Payments → Mock mode](./stripe-payments#mock-mode).

## 8. Move in

You now have:

- A signed `LeaseContract` in your document vault (`/dashboard/documents`).
- A monthly rent subscription you can pause/cancel only with the landlord’s agreement.
- A maintenance ticket form (`/dashboard/maintenance`) for repair requests.
- The ability to review your landlord and the property when the lease ends.

## Common follow-ups

- **Did the landlord ask for cash off-platform?** Decline and report via `/contact`. Off-platform payments forfeit dispute protection.
- **Need to leave early?** Open a dispute from the lease detail page. Disputes follow the policy described in [Concepts → Auth & Trust](../concepts/auth-and-trust).
- **Lost the keys?** Open a maintenance ticket. The landlord is notified instantly.
