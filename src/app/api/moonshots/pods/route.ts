import { NextResponse } from "next/server";
import { computePodReadiness, intentionalPodStore } from "@/lib/stores/moonshots";

export async function GET() {
  const pods = await intentionalPodStore.findAll();

  return NextResponse.json({
    data: pods.map((pod) => ({
      ...pod,
      readiness: computePodReadiness(pod),
    })),
    generatedAt: new Date().toISOString(),
  });
}
