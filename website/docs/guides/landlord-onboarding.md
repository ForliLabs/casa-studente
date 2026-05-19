---
sidebar_position: 2
title: Landlord Onboarding
description: List your first property and receive your first payout.
---

# Landlord Onboarding

A landlord can go from sign-up to first verified listing in under fifteen minutes. This guide covers the full path.

## 1. Create a landlord account

At `/auth/register`, pick **I want to rent out a property**. The form asks for:

- Legal name and Italian fiscal code (codice fiscale)
- Phone number (used for SMS verification)
- Address of the property you intend to list (one is required; you can add more later)

## 2. Verify your identity

The platform supports two paths:

1. **Document upload** — upload your ID (carta d’identità or passport). An admin reviews within 24 hours.
2. **SPID** _(coming soon)_ — instant verification once integrated.

Until verified, your listings stay in `draft` and are invisible to students.

## 3. Connect Stripe

Click **Connect payouts** in `/dashboard/landlord`. You’ll be redirected to Stripe Connect Express to provide:

- Italian IBAN
- VAT / fiscal regime (the form auto-suggests `cedolare secca`)
- A scan of your ID (Stripe’s own KYC)

When done, Stripe redirects you back. Your dashboard shows a green ✅ next to **Payouts active**.

## 4. Create your first listing

Go to `/dashboard/listings/new`. Fill in:

| Field | Notes |
| ----- | ----- |
| Title | Short and concrete: "Stanza singola luminosa vicino al Campus". |
| Address | Street + civic number; zone autocompletes. |
| Type | `stanza singola`, `stanza doppia`, `monolocale`, `bilocale`, `appartamento`. |
| All-inclusive price (€/month) | Rent + utilities + condominium fees + WiFi. **No hidden costs.** |
| Deposit | Capped at 3× monthly rent by Italian law. |
| Available from | ISO date. |
| Photos | Drag-and-drop. Minimum 5. Vercel Blob handles storage. |
| Features | Wi-Fi, lift, balcony, washing machine, etc. |
| Energy class | Required for compliance. |

:::tip Need help writing the description?
Click **Generate with AI**. The platform drafts a multilingual description from your photos and features. You can edit before publishing. (Powered by OpenAI; falls back to a template if `OPENAI_API_KEY` is unset.)
:::

## 5. Get verified

Once submitted, the listing enters the moderation queue at `/admin/moderation`. An admin will:

1. Confirm you own the property (cross-check with ID).
2. Sample-review the photos for authenticity.
3. Optionally schedule a video walkthrough.

A verified ✅ badge appears on the listing within 24 hours of submission in production.

## 6. Receive inquiries

When a student contacts you, you get an in-app and email notification. Reply directly from the conversation — translations are automatic if your locales differ.

Within the conversation you can:

- Send the **availability calendar** (auto-generated from your bookings).
- Propose a **tour time**.
- Send a **draft lease** preview.

## 7. Sign and activate the lease

From the conversation, click **Send lease to sign**. The platform generates a contract pre-filled with:

- Lease type (`transitorio` is the default for students)
- Duration (transitorio: 1–18 months)
- All-inclusive monthly rent
- Tax regime (`cedolare secca` toggle)
- Deposit amount

Both parties sign. The platform stamps a hash of each signature with timestamps and IP.

## 8. Receive your first payout

When the student pays the first month + deposit through Stripe Checkout:

- 95% lands in your Stripe Connect balance.
- 5% goes to the platform.
- A PDF receipt is emailed to both of you and added to your document vault.

Stripe pays out to your IBAN on the cadence you set (typically T+2 daily, or weekly).

## 9. Manage on the dashboard

`/dashboard/landlord` shows:

- **Calendar** — current and upcoming bookings.
- **Inquiries** — open conversations sorted by recency.
- **Analytics** — views, inquiry rate, conversion, avg. response time.
- **Payments** — incoming subscriptions, refunds, payout history.
- **Tax** — year-to-date income, downloadable in CSV with cedolare-secca-ready columns.

## What landlords get that they don’t elsewhere

- **University-verified tenants only.** No anonymous scammers.
- **Bidirectional reviews.** You rate the tenant; they rate you.
- **Optional rent guarantee.** Pay a small premium and we front the rent if the tenant defaults.
- **Dispute mediation.** A real human at admin level reviews evidence before any refund.
- **Tax exports.** Cedolare secca columns ready to paste into your accountant's spreadsheet.
