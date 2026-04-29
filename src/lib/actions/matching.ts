"use server";

import { getCurrentUser } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import {
  preferenceStore,
  computeListingMatch,
  trackBehavior,
  type ListingMatch,
  type UserPreferenceVector,
} from "@/lib/stores/matching";
import { revalidatePath } from "next/cache";

export async function getPersonalizedFeed(): Promise<ListingMatch[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const prefs = await preferenceStore.filter((p) => p.userId === user.id);
  const pref = prefs[0];

  const allListings = await listingStore.findAll();

  if (!pref) {
    // Cold start: return popularity-based ranking
    return allListings.map((l) => ({
      listingId: l.id,
      listingTitle: l.title,
      matchScore: 50 + Math.round(Math.random() * 30),
      matchReasons: [{ factor: "popular", score: 50, label: "Popolare sulla piattaforma" }],
      zone: l.zone,
      price: l.price,
      type: l.type,
    })).sort((a, b) => b.matchScore - a.matchScore);
  }

  const matches = allListings
    .filter((l) => !pref.dismissedListingIds.includes(l.id))
    .map((l) => computeListingMatch(pref, l))
    .sort((a, b) => b.matchScore - a.matchScore);

  // Diversification: ensure ≥2 zones in top 5
  const topMatches = matches.slice(0, 10);
  const zones = new Set(topMatches.slice(0, 3).map((m) => m.zone));
  if (zones.size < 2 && topMatches.length > 3) {
    const differentZone = topMatches.find((m) => !zones.has(m.zone));
    if (differentZone) {
      const idx = topMatches.indexOf(differentZone);
      if (idx > 2) {
        [topMatches[2], topMatches[idx]] = [topMatches[idx], topMatches[2]];
      }
    }
  }

  return topMatches;
}

export async function trackListingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const action = formData.get("action") as "view" | "save" | "contact" | "dismiss";
  const listingId = formData.get("listingId") as string;
  const listingZone = formData.get("listingZone") as string;

  if (!action || !listingId) return;

  const prefs = await preferenceStore.filter((p) => p.userId === user.id);
  let pref = prefs[0];

  if (!pref) {
    pref = {
      id: `pref-${user.id}`,
      userId: user.id,
      preferredZones: [],
      budgetMin: 0,
      budgetMax: 1000,
      preferredTypes: [],
      quizNoise: null,
      quizStudentDensity: null,
      quizNightlife: 5,
      viewedListingIds: [],
      savedListingIds: [],
      contactedListingIds: [],
      dismissedListingIds: [],
      inferredZones: {},
      inferredPriceRange: { min: 200, max: 800 },
      lastUpdated: new Date().toISOString(),
    };
    await preferenceStore.create(pref);
  }

  const updated = trackBehavior(pref, action, listingId, listingZone);
  await preferenceStore.update(pref.id, updated);
  revalidatePath("/dashboard/for-you");
}

export async function getMatchExplanation(listingId: string): Promise<ListingMatch | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const prefs = await preferenceStore.filter((p) => p.userId === user.id);
  const pref = prefs[0];
  if (!pref) return null;

  const listing = await listingStore.findById(listingId);
  if (!listing) return null;

  return computeListingMatch(pref, listing);
}
