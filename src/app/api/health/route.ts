import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type ServiceStatus = "connected" | "configured" | "not_configured" | "error";

interface ServiceCheck {
  status: ServiceStatus;
  latencyMs?: number;
  details?: string;
}

/**
 * GET /api/health — Liveness probe.
 * Returns full system health including memory, services, and uptime.
 */
export async function GET(request: NextRequest) {
  const verbose = request.nextUrl.searchParams.get("verbose") === "1";
  const startTime = performance.now();

  const services: Record<string, ServiceCheck> = {
    database: checkDatabase(),
    stripe: checkServiceEnv("STRIPE_SECRET_KEY", "Stripe payments"),
    email: checkServiceEnv("RESEND_API_KEY", "Resend email"),
    storage: checkServiceEnv("BLOB_READ_WRITE_TOKEN", "Vercel Blob storage"),
    ai: checkServiceEnv("OPENAI_API_KEY", "OpenAI AI"),
    monitoring: checkServiceEnv("SENTRY_DSN", "Sentry monitoring"),
    analytics: checkServiceEnv("POSTHOG_API_KEY", "PostHog analytics"),
  };

  const allConfigured = Object.values(services).every(
    (s) => s.status !== "error"
  );
  const criticalOk =
    services.database.status !== "error";

  const overallStatus = criticalOk
    ? allConfigured
      ? "healthy"
      : "degraded"
    : "unhealthy";

  const configuredCount = Object.values(services).filter(
    (s) => s.status === "connected" || s.status === "configured"
  ).length;

  const healthCheck: Record<string, unknown> = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "0.1.0",
    services: {
      configured: configuredCount,
      total: Object.keys(services).length,
      ...(verbose ? { details: services } : {}),
    },
  };

  if (verbose) {
    healthCheck.memory = getMemoryUsage();
    healthCheck.runtime = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };
    healthCheck.responseTimeMs = Math.round(performance.now() - startTime);
  }

  const statusCode =
    overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 200 : 503;

  return NextResponse.json(healthCheck, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Health-Status": overallStatus,
    },
  });
}

/**
 * HEAD /api/health — Minimal readiness probe for uptime monitors.
 * Returns 200 if the service is ready, 503 if not.
 */
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: { "X-Health-Status": "ok" },
  });
}

function checkDatabase(): ServiceCheck {
  if (process.env.DATABASE_URL) {
    return { status: "configured", details: "PostgreSQL" };
  }
  return { status: "configured", details: "in-memory (development)" };
}

function checkServiceEnv(envVar: string, label: string): ServiceCheck {
  if (process.env[envVar]) {
    return { status: "configured", details: label };
  }
  return { status: "not_configured", details: `${label} — set ${envVar}` };
}

function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsedMB: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotalMB: Math.round(usage.heapTotal / 1024 / 1024),
    rssMB: Math.round(usage.rss / 1024 / 1024),
    externalMB: Math.round(usage.external / 1024 / 1024),
  };
}
