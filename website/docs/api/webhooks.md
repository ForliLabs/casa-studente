---
sidebar_position: 3
title: Webhooks
description: The Stripe webhook handler contract.
---

# Webhooks

CasaStudente exposes exactly one webhook endpoint: `POST /api/webhooks/stripe`. It receives Stripe events, verifies the signature, and updates local state.

## Signature verification

```ts
const sig = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(
  await req.text(),
  sig!,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

Any failure to verify returns `400` and never touches application state. Always send the **raw** request body to Stripe’s SDK — the route uses `Request.text()` to preserve it.

## Handled events

| Event | Effect |
| ----- | ------ |
| `checkout.session.completed` | Activate `LeaseContract`, record `Payment`, notify both parties, increment trust. |
| `invoice.paid` | Append monthly rent payment, bump `TenantScore.punctuality`. |
| `invoice.payment_failed` | Notify, surface in admin queue, freeze new payouts on the lease. |
| `charge.refunded` | Mirror refund, update `Dispute.status`, notify both parties. |
| `account.updated` | Refresh `User.stripeAccountId` payout/onboarding state. |

Any other event type is acknowledged with `200` and ignored.

## Idempotency

Every handler upserts on Stripe IDs (`stripe_session_id`, `stripe_invoice_id`, `stripe_charge_id`). Replaying a webhook is safe — Stripe occasionally retries even after a `200`, and you'll never see double charges or duplicate notifications.

## Response codes

| Code | Meaning |
| ---- | ------- |
| `200` | Acknowledged. State updated (or no-op). |
| `400` | Signature verification failed. |
| `500` | Unexpected error. Logged to Sentry; Stripe will retry. |

## Local testing

Use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Then trigger events:

```bash
stripe trigger checkout.session.completed
stripe trigger invoice.payment_failed
```

The CLI prints a `whsec_*` secret on first run — copy it to your `.env` as `STRIPE_WEBHOOK_SECRET`.

## Mock mode

When `STRIPE_SECRET_KEY` is unset, the mock checkout page POSTs a synthetic `checkout.session.completed` payload directly into this route. Signature verification is skipped only when `process.env.NODE_ENV === 'development'` **and** the request comes from `localhost`. Don’t loosen that check.
