import { NextResponse } from "next/server";
import {
  computeResilienceBand,
  energyFlexWindowStore,
  resiliencePlanStore,
} from "@/lib/stores/moonshots";

export async function GET() {
  const [plans, windows] = await Promise.all([
    resiliencePlanStore.findAll(),
    energyFlexWindowStore.findAll(),
  ]);

  return NextResponse.json({
    plans: plans.map((plan) => ({
      ...plan,
      band: computeResilienceBand(plan.resilienceScore),
    })),
    windows,
    generatedAt: new Date().toISOString(),
  });
}
