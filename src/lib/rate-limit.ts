/**
 * Simple in-memory rate limiter for server actions.
 * In production, replace with Redis-based solution.
 */

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

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMITS = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },     // 5 attempts per 15 minutes
  api: { maxRequests: 100, windowMs: 60 * 1000 },          // 100 requests per minute
  actions: { maxRequests: 30, windowMs: 60 * 1000 },       // 30 actions per minute
  aiGenerate: { maxRequests: 50, windowMs: 24 * 60 * 60 * 1000 }, // 50 per day
} as const;

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
