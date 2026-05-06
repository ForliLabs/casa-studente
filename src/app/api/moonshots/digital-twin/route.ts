import { NextResponse } from "next/server";
import {
  computeTwinOpportunityScore,
  twinInterventionStore,
  urbanTwinZoneStore,
} from "@/lib/stores/moonshots";

export async function GET() {
  const [signals, interventions] = await Promise.all([
    urbanTwinZoneStore.findAll(),
    twinInterventionStore.findAll(),
  ]);

  return NextResponse.json({
    zones: signals.map((signal) => ({
      ...signal,
      opportunityScore: computeTwinOpportunityScore(signal),
    })),
    interventions,
    generatedAt: new Date().toISOString(),
  });
}
