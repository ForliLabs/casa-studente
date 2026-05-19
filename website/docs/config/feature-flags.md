---
sidebar_position: 3
title: Feature Flags
description: Toggling experimental and moonshot features.
---

# Feature Flags

CasaStudente uses a simple environment-driven flag system for **moonshot** modules (the experimental features under `/api/moonshots/**` and `src/lib/stores/moonshots`). Flags are read once at boot and exposed via `src/lib/flags.ts`.

## Available flags

| Flag | Default | Description |
| ---- | ------- | ----------- |
| `FEATURE_GUARANTEED_RENT` | `false` | Optional add-on where the platform fronts rent if a tenant defaults. |
| `FEATURE_DIGITAL_TWIN` | `false` | 3D digital twin viewer for listings. |
| `FEATURE_CONCIERGE` | `false` | Arrival concierge service for international students. |
| `FEATURE_HOUSING_PASSPORT` | `false` | Portable trust profile usable on other platforms. |
| `FEATURE_RESILIENCE_FUND` | `false` | Community fund for displaced students. |
| `FEATURE_CO_LIVING_PODS` | `false` | Inventory type for short-term co-living. |
| `FEATURE_FORECASTING` | `true` | Market demand forecasting in landlord analytics. |
| `FEATURE_OPEN_DATA` | `true` | Institutional data APIs (`/api/institutional/*`). |

Set in `.env`:

```bash
FEATURE_GUARANTEED_RENT="true"
FEATURE_DIGITAL_TWIN="false"
```

## Reading flags

```ts
import { flags } from '@/lib/flags';

if (flags.guaranteedRent) {
  // render rent-guarantee CTA
}
```

`flags` is a typed, frozen object so misuse fails at compile time.

## Per-user flags

For gradual rollouts, override at the user level:

```ts
import { flagsForUser } from '@/lib/flags';

const userFlags = flagsForUser(user);
if (userFlags.digitalTwin) { /* … */ }
```

Per-user flags fall back to global flags. Override priority: **user > global > default**.

## Adding a new flag

1. Add the default to `src/lib/flags.ts`.
2. Document it in this page.
3. Reference it from feature code via `flags.myFeature` — never via `process.env` directly.
4. Add a test in `tests/unit/moonshots.test.ts` (or wherever the feature lives) that exercises both states.

Keeping flags centralised means we can later swap in a real flag service (LaunchDarkly, Statsig, GrowthBook) without touching feature code.
