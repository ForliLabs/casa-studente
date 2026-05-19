---
sidebar_position: 5
title: AI Features
description: Natural-language search, listing descriptions, and chat translation.
---

# AI Features

CasaStudente uses OpenAI's `gpt-4o-mini` for three jobs:

1. **Natural-language search** — parse a free-text query into a structured `ListingFilter`.
2. **Listing description generation** — turn a list of features into copy in IT/EN/ES/FR.
3. **Message translation** — translate conversation messages between user locales.

Every AI feature has a **deterministic fallback** that runs when `OPENAI_API_KEY` is not set, so the product never fails closed.

## Wire-up

Set the key:

```bash
# .env
OPENAI_API_KEY="sk-..."
```

Restart the dev server. That's it — there's no separate AI service to deploy.

## Natural-language search

```ts
import { parseSearchQuery } from '@/lib/services/ai';

const filter = await parseSearchQuery(
  'doppia non fumatori entro 350€ con lavatrice',
  { locale: 'it' }
);
// {
//   type: 'stanza doppia',
//   priceMax: 350,
//   features: ['lavatrice'],
//   restrictions: ['no_smoking']
// }
```

The model is constrained to return a JSON schema; invalid output triggers the fallback parser.

### Fallback

When the API key is missing or the model misbehaves, a deterministic keyword parser handles common Italian and English patterns:

```ts
// 'singola entro 400€ vicino al Campus' →
// { type: 'stanza singola', priceMax: 400, zone: 'Campus' }
```

Covered by `tests/unit/ai-service.test.ts`.

## Listing description generation

```ts
import { generateListingDescription } from '@/lib/services/ai';

const desc = await generateListingDescription({
  features: ['Wi-Fi fibra', 'Balcone', 'Scrivania ampia'],
  zone: 'Campus',
  type: 'stanza singola',
  locales: ['it', 'en', 'es', 'fr'],
});
// {
//   it: 'Stanza singola luminosa...',
//   en: 'Bright single room...',
//   es: 'Habitación individual...',
//   fr: 'Chambre individuelle...'
// }
```

Landlords trigger this from the "Generate with AI" button on the new listing form. The output is always editable.

## Message translation

When two users have different `User.locale`, every message is translated and cached on the `Message.bodyTranslated` field. The original is preserved verbatim. See [Concepts → Messaging](../concepts/messaging) for the lifecycle.

## Cost controls

- All three features use **gpt-4o-mini**, currently Stripe-cheap.
- Translations are cached per-message, so a thread of 50 messages between an Italian and an Erasmus student costs only 50 translations total, not 50 per page load.
- A monthly hard cap can be set via `OPENAI_MONTHLY_BUDGET_USD`. When exceeded, the service silently switches to fallback mode for the rest of the month.

## Safety

- We never send user PII to the model. Names, emails and phone numbers are stripped server-side before prompting.
- Listings are sent **after** moderation, so the model never sees flagged content.
- The translation prompt explicitly forbids modifying URLs, IBANs or phone numbers, to avoid laundering of off-platform contact attempts.
