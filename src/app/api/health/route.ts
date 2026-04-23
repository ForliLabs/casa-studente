import { NextResponse } from "next/server";

export async function GET() {
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "0.1.0",
    checks: {
      memory: getMemoryUsage(),
      store: "in-memory",
    },
  };

  return NextResponse.json(healthCheck, { status: 200 });
}

function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsedMB: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotalMB: Math.round(usage.heapTotal / 1024 / 1024),
    rssMB: Math.round(usage.rss / 1024 / 1024),
  };
}
