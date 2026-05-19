---
sidebar_position: 5
title: Rate Limits
description: How CasaStudente throttles abusive requests.
---

# Rate Limits

CasaStudente uses an in-memory token-bucket rate limiter (`src/lib/rate-limit.ts`). Limits are per-user when a session is present and per-IP otherwise. When a limit is hit, the response is `429 Too Many Requests` with a `Retry-After` header in seconds.

## Default windows

| Surface | Bucket | Window |
| ------- | ------ | ------ |
| Public listings (`GET /api/listings*`) | 60 req | 1 minute |
| Auth (login, register, password reset) | 5 req | 5 minutes |
| Messaging (per conversation) | 20 msg | 1 hour |
| Messaging (per user, all threads) | 100 msg | 1 hour |
| Stripe checkout creation | 10 req | 10 minutes |
| File upload | 30 req | 1 hour |
| Institutional APIs | 60 req | 1 minute |
| AI search / generation | 30 req | 1 hour |
| Saved-search creation | 20 req | 1 hour |

## Multi-instance deployments

The default rate limiter is **process-local**. If you deploy multiple Vercel instances (autoscaling), each enforces limits independently. For stricter, globally-coordinated limits, swap in an Upstash Redis-backed limiter — the interface in `src/lib/rate-limit.ts` is small:

```ts
export interface RateLimiter {
  consume(key: string, weight?: number): Promise<{ ok: boolean; retryAfter: number }>;
}
```

Drop-in replacement example:

```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const limiter: RateLimiter = {
  async consume(key, weight = 1) {
    const r = await new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.tokenBucket(100, '1 h', 100),
    }).limit(key, { rate: weight });
    return { ok: r.success, retryAfter: Math.ceil((r.reset - Date.now()) / 1000) };
  },
};
```

## Honouring `Retry-After`

Clients should always honour the `Retry-After` header. Example:

```ts
async function withBackoff(req: () => Promise<Response>) {
  for (let i = 0; i < 3; i++) {
    const res = await req();
    if (res.status !== 429) return res;
    const wait = Number(res.headers.get('retry-after') ?? 60);
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
  throw new Error('Rate limited after 3 attempts');
}
```

## Bypass for admins

Admin sessions bypass per-user limits but still hit per-IP limits, so an admin running automated scripts from a single machine cannot accidentally take down the platform.
