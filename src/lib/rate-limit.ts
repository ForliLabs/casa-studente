/**
 * In-memory sliding window rate limiter for server actions and API routes.
 *
 * Uses a simple count-per-window approach with automatic cleanup of expired
 * entries every 60 seconds.
 *
 * @remarks
 * This implementation is suitable for single-process development servers.
 * In production (Vercel serverless), replace with a Redis-based solution
 * (e.g., `@upstash/ratelimit`) since each serverless invocation gets its
 * own memory space.
 *
 * @module rate-limit
 */

/** @internal Entry tracking request count and window expiration. */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, 60000);

/** Configuration for a rate limit rule. */
export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window. */
  maxRequests: number;
  /** Time window in milliseconds. */
  windowMs: number;
}

/**
 * Pre-configured rate limit profiles for different contexts.
 *
 * | Profile      | Limit | Window     |
 * |-------------|-------|------------|
 * | `auth`       | 5     | 15 minutes |
 * | `api`        | 100   | 1 minute   |
 * | `actions`    | 30    | 1 minute   |
 * | `aiGenerate` | 50    | 24 hours   |
 */
export const RATE_LIMITS = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },     // 5 attempts per 15 minutes
  api: { maxRequests: 100, windowMs: 60 * 1000 },          // 100 requests per minute
  actions: { maxRequests: 30, windowMs: 60 * 1000 },       // 30 actions per minute
  aiGenerate: { maxRequests: 50, windowMs: 24 * 60 * 60 * 1000 }, // 50 per day
} as const;

/**
 * Check whether a request is allowed under the given rate limit.
 *
 * @param key - Unique identifier for the rate limit bucket (e.g., `auth:user@example.com`).
 * @param config - The rate limit configuration to apply.
 * @returns An object with `allowed` (boolean) and `remaining` request count.
 *
 * @example
 * ```typescript
 * const { allowed, remaining } = checkRateLimit(`auth:${email}`, RATE_LIMITS.auth);
 * if (!allowed) {
 *   return { error: "Troppi tentativi. Riprova più tardi." };
 * }
 * ```
 */
export function checkRateLimit(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  entry.count++;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  if (entry.count > config.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining };
}
