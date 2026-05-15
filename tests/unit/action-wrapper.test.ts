import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import {
  withActionMonitoring,
  extractFormFields,
  ACTION_DEFAULTS,
} from "@/lib/action-wrapper";

// Mock the monitoring module to avoid side effects
vi.mock("@/lib/services/monitoring", () => ({
  captureError: vi.fn(),
  measurePerformance: vi.fn((_name: string, fn: () => unknown) => fn()),
  structuredLog: vi.fn(),
  generateCorrelationId: vi.fn(() => "test-correlation-id"),
  setCorrelationId: vi.fn(),
}));

describe("withActionMonitoring", () => {
  const testSchema = z.object({
    name: z.string().min(2),
    value: z.number().positive(),
  });

  it("validates input and returns success", async () => {
    const handler = vi.fn().mockResolvedValue({ id: "123" });
    const action = withActionMonitoring(
      { name: "testAction", schema: testSchema },
      handler
    );

    const result = await action({ name: "test", value: 42 });
    expect(result).toEqual({ success: true, data: { id: "123" } });
    expect(handler).toHaveBeenCalledWith({ name: "test", value: 42 });
  });

  it("returns validation error for invalid input", async () => {
    const handler = vi.fn();
    const action = withActionMonitoring(
      { name: "testAction", schema: testSchema },
      handler
    );

    const result = await action({ name: "x", value: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("VALIDATION_ERROR");
    }
    expect(handler).not.toHaveBeenCalled();
  });

  it("handles handler errors gracefully", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("DB failure"));
    const action = withActionMonitoring(
      { name: "testAction", schema: testSchema },
      handler
    );

    const result = await action({ name: "test", value: 42 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("INTERNAL_ERROR");
    }
  });

  it("works without schema (pass-through)", async () => {
    const handler = vi.fn().mockResolvedValue("ok");
    const action = withActionMonitoring({ name: "noSchema" }, handler);

    const result = await action({ any: "input" });
    expect(result).toEqual({ success: true, data: "ok" });
  });

  it("applies rate limiting", async () => {
    const handler = vi.fn().mockResolvedValue("ok");
    const action = withActionMonitoring(
      {
        name: "rateLimited",
        rateLimit: { maxRequests: 2, windowMs: 60000 },
        rateLimitKey: () => "test-rate-key-unique",
      },
      handler
    );

    // First two calls should succeed
    const r1 = await action({});
    const r2 = await action({});
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);

    // Third call should be rate limited
    const r3 = await action({});
    expect(r3.success).toBe(false);
    if (!r3.success) {
      expect(r3.code).toBe("RATE_LIMITED");
    }
  });

  it("handles non-Error throws", async () => {
    const handler = vi.fn().mockRejectedValue("string error");
    const action = withActionMonitoring({ name: "stringError" }, handler);

    const result = await action({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("INTERNAL_ERROR");
    }
  });
});

describe("extractFormFields", () => {
  it("extracts specified fields from FormData", () => {
    const formData = new FormData();
    formData.set("name", "Test");
    formData.set("email", "test@example.com");
    formData.set("extra", "ignored");

    const result = extractFormFields(formData, ["name", "email"]);
    expect(result).toEqual({ name: "Test", email: "test@example.com" });
    expect(result).not.toHaveProperty("extra");
  });

  it("skips missing fields", () => {
    const formData = new FormData();
    formData.set("name", "Test");

    const result = extractFormFields(formData, ["name", "missing"]);
    expect(result).toEqual({ name: "Test" });
  });
});

describe("ACTION_DEFAULTS", () => {
  it("has auth defaults with rate limiting", () => {
    expect(ACTION_DEFAULTS.auth.rateLimit).toBeDefined();
    expect(ACTION_DEFAULTS.auth.rateLimit.maxRequests).toBe(5);
  });

  it("has mutation defaults with rate limiting", () => {
    expect(ACTION_DEFAULTS.mutation.rateLimit.maxRequests).toBe(30);
  });

  it("has AI generate defaults with daily limit", () => {
    expect(ACTION_DEFAULTS.aiGenerate.rateLimit.maxRequests).toBe(50);
    expect(ACTION_DEFAULTS.aiGenerate.rateLimit.windowMs).toBe(24 * 60 * 60 * 1000);
  });
});
