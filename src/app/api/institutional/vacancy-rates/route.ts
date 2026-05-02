import { NextResponse } from "next/server";
import { institutionalMetricStore, institutionalKeyStore } from "@/lib/stores/university-sso";

async function validateAPIKey(request: Request): Promise<{ valid: boolean; universityId?: string }> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { valid: false };
  }
  const keys = await institutionalKeyStore.findAll();
  const activeKey = keys.find((k) => k.active);
  if (!activeKey) return { valid: false };
  return { valid: true, universityId: activeKey.universityId };
}

export async function GET(request: Request) {
  const auth = await validateAPIKey(request);
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized — valid API key required" }, { status: 401 });
  }

  const metrics = await institutionalMetricStore.filter(
    (m) => m.universityId === auth.universityId
  );

  const vacancyData = metrics.map((m) => ({
    period: m.period,
    vacancyRate: m.vacancyRate,
    totalListings: m.totalListings,
    totalStudents: m.totalStudents,
  }));

  return NextResponse.json({
    university: auth.universityId,
    data: vacancyData,
    generatedAt: new Date().toISOString(),
  });
}
