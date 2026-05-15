import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildHealthReport } from "@/lib/health";

/**
 * GET /api/health — Liveness probe.
 * Returns full system health including memory, services, and uptime.
 */
export async function GET(request: NextRequest) {
  const verbose = request.nextUrl.searchParams.get("verbose") === "1";
  const startTime = performance.now();
  const report = buildHealthReport({
    verbose,
    responseTimeMs: Math.round(performance.now() - startTime),
  });

  const statusCode = report.status === "unhealthy" ? 503 : 200;

  return NextResponse.json(report, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Health-Status": report.status,
    },
  });
}

/**
 * HEAD /api/health — Minimal readiness probe for uptime monitors.
 * Returns 200 if the service is ready, 503 if not.
 */
export async function HEAD() {
  const report = buildHealthReport();

  return new NextResponse(null, {
    status: report.status === "unhealthy" ? 503 : 200,
    headers: { "X-Health-Status": report.status },
  });
}
