import { NextResponse } from "next/server";
import {
  computeGuaranteeSimulation,
  guaranteedRentOfferStore,
} from "@/lib/stores/moonshots";

export async function GET() {
  const offers = await guaranteedRentOfferStore.findAll();

  return NextResponse.json({
    data: offers.map((offer) => ({
      ...offer,
      simulation: computeGuaranteeSimulation(offer),
    })),
    generatedAt: new Date().toISOString(),
  });
}
