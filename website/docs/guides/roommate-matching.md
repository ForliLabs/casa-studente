---
sidebar_position: 3
title: Roommate Matching
description: How CasaStudente scores compatibility between students.
---

# Roommate Matching

CasaStudente runs a deterministic, explainable compatibility score between any two students. It’s built for clarity, not magic: every input is visible, every weight is configurable, every score can be reproduced.

## Inputs

Each student fills a `RoommateProfile` during onboarding:

```ts
type RoommateProfile = {
  budgetMin: number;
  budgetMax: number;
  sleep: 'early' | 'balanced' | 'night';
  cleanliness: 'relaxed' | 'tidy' | 'immaculate';
  social: 'introvert' | 'balanced' | 'extrovert';
  languages: string[];        // ISO 639-1 codes
  studyProgram?: string;
  smokingOk: boolean;
  petsOk: boolean;
  guestsOk: 'never' | 'sometimes' | 'often';
};
```

## Scoring

The algorithm in `src/lib/services/compatibility.ts` returns a `score` in `[0, 100]` plus a breakdown:

```ts
const result = scoreCompatibility(profileA, profileB);
// {
//   score: 78,
//   breakdown: {
//     budget: 92,
//     sleep: 80,
//     cleanliness: 60,
//     social: 70,
//     language: 100,
//     deal_breakers: { smoking: true, pets: true }
//   }
// }
```

Weights (default):

| Dimension | Weight | Notes |
| --------- | ------ | ----- |
| Budget overlap | 0.25 | Penalty proportional to the gap between budget ranges. |
| Sleep schedule | 0.20 | Adjacent values score 0.5, opposite values 0. |
| Cleanliness | 0.20 | Identical = 1, adjacent = 0.6, opposite = 0.1. |
| Social style | 0.15 | Same as cleanliness. |
| Shared languages | 0.20 | Jaccard over language sets. |
| Smoking, pets, guests | hard filters | Mismatch sets `deal_breakers` and **caps** the score at 40. |

If any deal-breaker fires (e.g. one smokes, the other doesn't), the pair is not shown as a suggestion regardless of the numeric score.

## Where it’s used

- `/roommates` — discover compatible students near you.
- Listing detail page — when a listing has multiple rooms, suggested co-tenants are surfaced.
- Housing groups (`HousingGroup`) — students form a group around a 3-bedroom apartment and invite candidates.

## Privacy

Compatibility runs **server-side** only. Other users see compatibility scores, not raw profile values. A student must explicitly send a connection request to share full profile details.

## Tested behaviour

The algorithm is exercised by `tests/unit/features.test.ts`:

```bash
npm test -- features
# ✓ scoreCompatibility — identical profiles → 100
# ✓ scoreCompatibility — opposite sleep → ≤ 70
# ✓ scoreCompatibility — smoking mismatch → capped at 40
# ✓ scoreCompatibility — empty language overlap → ≤ 80
```
