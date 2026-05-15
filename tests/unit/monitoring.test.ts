import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Sentry before importing monitoring
vi.mock("@sentry/node", () => ({
  init: vi.fn(),
  withScope: vi.fn((cb) => cb({ setUser: vi.fn(), setTag: vi.fn(), setExtras: vi.fn() })),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));

import {
  captureError,
  captureMessage,
  structuredLog,
  generateCorrelationId,
  setCorrelationId,
  measurePerformance,
  isMonitoringConfigured,
  getMonitoringStatus,
} from "@/lib/services/monitoring";

describe("Monitoring — Structured Logging", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("logs info messages", () => {
    structuredLog("info", "Test info message", { key: "value" });
    expect(console.log).toHaveBeenCalled();
  });

  it("logs error messages", () => {
    structuredLog("error", "Test error", { stack: "trace" });
    expect(console.log).toHaveBeenCalled();
  });

  it("logs warning messages", () => {
    structuredLog("warning", "Test warning");
    expect(console.log).toHaveBeenCalled();
  });
});

describe("Monitoring — Correlation IDs", () => {
  it("generates unique correlation IDs", () => {
    const id1 = generateCorrelationId();
    const id2 = generateCorrelationId();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^req-/);
  });

  it("sets correlation ID without throwing", () => {
    expect(() => setCorrelationId("test-id")).not.toThrow();
  });
});

describe("Monitoring — Error Capture", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("captures Error objects", () => {
    expect(() =>
      captureError(new Error("test error"), { action: "testAction" })
    ).not.toThrow();
  });

  it("captures string errors", () => {
    expect(() =>
      captureError("string error message", { userId: "user-1" })
    ).not.toThrow();
  });

  it("captures with full context", () => {
    expect(() =>
      captureError(new Error("full context"), {
        userId: "user-1",
        action: "createListing",
        page: "/dashboard",
        extra: { listingId: "abc" },
      })
    ).not.toThrow();
  });
});

describe("Monitoring — Performance Measurement", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("measures synchronous function", async () => {
    const result = await measurePerformance("syncTest", () => 42);
    expect(result).toBe(42);
  });

  it("measures async function", async () => {
    const result = await measurePerformance("asyncTest", async () => {
      return "async result";
    });
    expect(result).toBe("async result");
  });

  it("propagates errors from measured function", async () => {
    // Sync throws are not caught by measurePerformance, they propagate directly
    expect(() =>
      measurePerformance("errorTest", () => {
        throw new Error("measured error");
      })
    ).toThrow("measured error");
  });

  it("propagates errors from async measured function", async () => {
    await expect(
      measurePerformance("asyncErrorTest", async () => {
        throw new Error("async measured error");
      })
    ).rejects.toThrow("async measured error");
  });
});

describe("Monitoring — Message Capture", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  it("captures info messages", () => {
    expect(() => captureMessage("info test")).not.toThrow();
  });

  it("captures warning messages with context", () => {
    expect(() =>
      captureMessage("warning test", "warning", { detail: "something" })
    ).not.toThrow();
  });
});

describe("Monitoring — Service Status", () => {
  it("reports monitoring as not configured in test env", () => {
    expect(isMonitoringConfigured()).toBe(false);
  });

  it("returns monitoring status object", () => {
    const status = getMonitoringStatus();
    expect(status).toHaveProperty("sentry");
    expect(status).toHaveProperty("posthog");
    expect(status).toHaveProperty("environment");
  });
});
