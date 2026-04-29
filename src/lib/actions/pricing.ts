"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  estimatePrice,
  getPriceBadge,
  getZoneStats,
  priceTrendStore,
  priceDataStore,
  type PriceEstimate,
  type PriceTrend,
  type ZonePriceStats,
} from "@/lib/stores/pricing";
import { listingStore, type Listing } from "@/lib/data";

export async function getPriceEstimateAction(formData: FormData) {
  const zone = formData.get("zone") as string;
  const type = formData.get("type") as string;
  const size = Number(formData.get("size")) || 20;
  const furnished = formData.get("furnished") === "true";
  const floor = formData.get("floor") as string || "1° piano";
  const actualPrice = Number(formData.get("actualPrice")) || 0;

  const estimate = estimatePrice({ zone, type, size, furnished, floor });

  if (actualPrice > 0) {
    estimate.badge = getPriceBadge(actualPrice, estimate.estimatedPrice);
  }

  return { success: true, estimate };
}

export async function getListingPriceAnalysis(listingId: string): Promise<{
  estimate: PriceEstimate;
  zoneStats: ZonePriceStats;
  trends: PriceTrend[];
  badge: string;
} | null> {
  const listing = await listingStore.findById(listingId);
  if (!listing) return null;

  const estimate = estimatePrice({
    zone: listing.zone,
    type: listing.type,
    size: listing.size,
    furnished: listing.furnished,
    floor: listing.floor,
  });

  estimate.badge = getPriceBadge(listing.price, estimate.estimatedPrice);
  const zoneStats = getZoneStats(listing.zone, listing.type);
  const trends = await priceTrendStore.filter(
    (t) => t.zone === listing.zone && t.type === listing.type
  );

  return {
    estimate,
    zoneStats,
    trends: trends.sort((a, b) => a.month.localeCompare(b.month)),
    badge: estimate.badge,
  };
}

export async function getAllListingsWithPricing(): Promise<
  (Listing & { priceBadge: string; estimatedPrice: number })[]
> {
  const allListings = await listingStore.findAll();

  return allListings.map((listing) => {
    const estimate = estimatePrice({
      zone: listing.zone,
      type: listing.type,
      size: listing.size,
      furnished: listing.furnished,
      floor: listing.floor,
    });
    const badge = getPriceBadge(listing.price, estimate.estimatedPrice);
    return { ...listing, priceBadge: badge, estimatedPrice: estimate.estimatedPrice };
  });
}

export async function getLandlordPricingInsights() {
  const user = await getCurrentUser();
  if (!user || user.role !== "landlord") return null;

  const allListings = await listingStore.findAll();
  const insights = allListings.map((listing) => {
    const estimate = estimatePrice({
      zone: listing.zone,
      type: listing.type,
      size: listing.size,
      furnished: listing.furnished,
      floor: listing.floor,
    });
    const badge = getPriceBadge(listing.price, estimate.estimatedPrice);
    const zoneStats = getZoneStats(listing.zone, listing.type);
    const priceDiff = Math.round(((listing.price - estimate.estimatedPrice) / estimate.estimatedPrice) * 100);

    return {
      listingId: listing.id,
      listingTitle: listing.title,
      currentPrice: listing.price,
      estimatedPrice: estimate.estimatedPrice,
      priceDiff,
      badge,
      zoneMedian: zoneStats.median,
      suggestion: priceDiff > 15
        ? `Il tuo prezzo è ${priceDiff}% sopra la media. Considera di abbassare a €${estimate.estimatedPrice}/mese per ricevere più richieste.`
        : priceDiff < -10
        ? `Ottimo prezzo! Il tuo annuncio è ${Math.abs(priceDiff)}% sotto la media di zona — dovrebbe attirare molte richieste.`
        : "Il tuo prezzo è in linea con il mercato della zona.",
    };
  });

  revalidatePath("/dashboard/pricing");
  return insights;
}
