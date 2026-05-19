---
sidebar_position: 4
title: Stripe Payments
description: From mock mode on your laptop to live Stripe Connect in production.
---

# Stripe Payments

CasaStudente uses **Stripe Connect Express** for marketplace payments. This guide covers the three states your environment can be in: mock, test, and live.

## Mock mode

When `STRIPE_SECRET_KEY` is empty, the platform runs an entirely local simulation:

```ts
// src/lib/services/stripe.ts (simplified)
export async function createCheckoutSession(input: CheckoutInput) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      id: `cs_test_mock_${cuid()}`,
      url: `/dashboard/payments/mock?amount=${input.amount}`,
    };
  }
  return stripe.checkout.sessions.create(/* ... */);
}
```

- `createCheckoutSession` returns a local URL that emulates a successful checkout.
- The mock page POSTs a fake webhook back into `/api/webhooks/stripe`, so all downstream state (lease activation, payment record, notification) runs exactly as in production.
- `account.updated` for landlords completes immediately, so onboarding is one click.

Mock mode is what makes the seeded demo accounts useful out of the box.

## Test mode (real Stripe, no real money)

1. Create a Stripe account and switch the dashboard to **Test mode**.
2. Copy your **test secret key** and **publishable key**:

   ```bash
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_PLATFORM_FEE_PERCENT="5"
   ```

3. Set up a webhook endpoint pointing at `http://localhost:3000/api/webhooks/stripe` using the Stripe CLI:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Stripe prints a `whsec_*` secret. Put it in `.env`:

   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. Restart the dev server. Now payments flow through Stripe, but use test cards:

   ```text
   4242 4242 4242 4242   any future expiry   any CVC   any ZIP
   ```

## Live mode

For production:

1. Activate your Stripe account (full business KYC).
2. Switch keys to **Live mode** in your hosting environment (Vercel → Environment Variables).
3. Configure the webhook in the Stripe dashboard pointing at `https://your-domain.tld/api/webhooks/stripe`. Save the `whsec_*` value as `STRIPE_WEBHOOK_SECRET`.
4. Onboard landlords through Connect Express in live mode. Each landlord completes Stripe's KYC; until they do, their Connect account `payouts_enabled` flag stays `false` and the platform blocks them from receiving rent.

## Platform fee

```bash
STRIPE_PLATFORM_FEE_PERCENT="5"
```

This is applied as Stripe's `application_fee_amount` on every checkout. Lower it for promotional periods, raise it on premium plans. The fee appears as a separate line on the landlord's payout statement.

## Webhooks reference

| Event | Handler effect |
| ----- | -------------- |
| `checkout.session.completed` | Activate `LeaseContract`, record `Payment`, notify both parties. |
| `invoice.paid` | Record monthly rent payment, bump `TenantScore.punctuality`. |
| `invoice.payment_failed` | Notify, surface in admin queue, freeze new payouts. |
| `charge.refunded` | Update dispute record, notify both parties. |
| `account.updated` | Refresh landlord onboarding/payouts status. |

Signature verification uses `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`. Failed verification returns `400` and never touches state.

## Refunds and disputes

Refunds are issued via Server Action, never directly from the UI:

```ts
// src/lib/actions/payments.ts
'use server';
export async function refundPayment(input: { paymentId: string; reason: string }) {
  requireRole('admin');
  await stripe.refunds.create({ payment_intent: payment.stripePaymentIntentId });
  await markRefunded(payment.id, input.reason);
}
```

This guarantees an audit trail (admin user, reason, dispute reference) for every refund.

## Going further

- [Concepts → Payments](../concepts/payments) — money flow and architecture.
- [API → Webhooks](../api/webhooks) — payload schemas.
- [Troubleshooting](../troubleshooting#payments) — common Stripe issues.
