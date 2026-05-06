import { NextResponse } from "next/server";
import {
  arrivalTrackStore,
  computeArrivalReadiness,
} from "@/lib/stores/moonshots";

export async function GET() {
  const tracks = await arrivalTrackStore.findAll();

  return NextResponse.json({
    data: tracks.map((track) => ({
      ...track,
      readinessScore: computeArrivalReadiness(track.checkpoints),
    })),
    generatedAt: new Date().toISOString(),
  });
}
