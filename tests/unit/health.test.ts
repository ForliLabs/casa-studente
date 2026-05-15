import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { buildHealthReport } from "@/lib/health";
import { GET, HEAD } from "@/app/api/health/route";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Health report", () => {
  it("reports degraded when optional integrations are missing", () => {
    const report = buildHealthReport({
      env: { NODE_ENV: "test" },
      uptimeSeconds: 42,
      now: new Date("2026-01-01T00:00:00.000Z"),
      verbose: true,
      memoryUsage: {
        rss: 80 * 1024 * 1024,
        heapTotal: 40 * 1024 * 1024,
        heapUsed: 20 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        arrayBuffers: 0,
      },
      runtime: {
        nodeVersion: "v22.0.0",
        platform: "linux",
        arch: "x64",
      },
    });

    expect(report.status).toBe("degraded");
    expect(report.services.details.database.status).toBe("configured");
    expect(report.services.configured).toBe(1);
    expect(report.memory?.heapUsedMB).toBe(20);
    expect(report.readiness.servesTraffic).toBe(true);
  });

  it("reports unhealthy in production without a database", () => {
    const report = buildHealthReport({
      env: { NODE_ENV: "production" },
      uptimeSeconds: 5,
    });

    expect(report.status).toBe("unhealthy");
    expect(report.services.details.database.status).toBe("error");
    expect(report.readiness.servesTraffic).toBe(false);
  });

  it("reports healthy when all integrations are configured", () => {
    const report = buildHealthReport({
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "postgres://demo",
        STRIPE_SECRET_KEY: "sk_test",
        RESEND_API_KEY: "re_demo",
        BLOB_READ_WRITE_TOKEN: "blob_demo",
        OPENAI_API_KEY: "openai_demo",
        SENTRY_DSN: "https://sentry.example",
        POSTHOG_API_KEY: "phc_demo",
      },
      uptimeSeconds: 120,
    });

    expect(report.status).toBe("healthy");
    expect(report.services.configured).toBe(report.services.total);
    expect(report.readiness.observabilityReady).toBe(true);
    expect(report.readiness.paymentsReady).toBe(true);
  });
});

describe("Health route", () => {
  it("returns verbose health payload", async () => {
    vi.stubEnv("NODE_ENV", "test");
    const response = await GET(new NextRequest("http://localhost/api/health?verbose=1"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Health-Status")).toBe("degraded");
    expect(body).toHaveProperty("memory");
    expect(body).toHaveProperty("runtime");
  });

  it("returns 503 from HEAD when critical services are unavailable", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DATABASE_URL", "");

    const response = await HEAD();

    expect(response.status).toBe(503);
    expect(response.headers.get("X-Health-Status")).toBe("unhealthy");
  });
});
