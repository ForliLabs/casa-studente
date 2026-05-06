import { describe, it, expect } from "vitest";
import { checkRateLimit, RATE_LIMITS, type RateLimitConfig } from "@/lib/rate-limit";

describe("Rate Limiter", () => {
  const testConfig: RateLimitConfig = { maxRequests: 3, windowMs: 60000 };

  it("allows requests within limit", () => {
    const key = `test-${Date.now()}-allow`;
    const r1 = checkRateLimit(key, testConfig);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(key, testConfig);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(key, testConfig);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests exceeding limit", () => {
    const key = `test-${Date.now()}-block`;
    checkRateLimit(key, testConfig);
    checkRateLimit(key, testConfig);
    checkRateLimit(key, testConfig);

    const r4 = checkRateLimit(key, testConfig);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });

  it("uses separate counters per key", () => {
    const keyA = `test-${Date.now()}-a`;
    const keyB = `test-${Date.now()}-b`;

    checkRateLimit(keyA, testConfig);
    checkRateLimit(keyA, testConfig);
    checkRateLimit(keyA, testConfig);

    const rB = checkRateLimit(keyB, testConfig);
    expect(rB.allowed).toBe(true);
    expect(rB.remaining).toBe(2);
  });

  it("has preset configs", () => {
    expect(RATE_LIMITS.auth.maxRequests).toBe(5);
    expect(RATE_LIMITS.auth.windowMs).toBe(15 * 60 * 1000);
    expect(RATE_LIMITS.api.maxRequests).toBe(100);
    expect(RATE_LIMITS.actions.maxRequests).toBe(30);
    expect(RATE_LIMITS.aiGenerate.maxRequests).toBe(50);
  });
});
