import { InMemoryStore } from "@/lib/db";

// ============ SMART MATCHING ENGINE ============

export interface UserPreferenceVector {
  id: string;
  userId: string;
  // From saved searches
  preferredZones: string[];
  budgetMin: number;
  budgetMax: number;
  preferredTypes: string[];
  // From neighborhood quiz
  quizNoise: "quiet" | "moderate" | "lively" | null;
  quizStudentDensity: "low" | "medium" | "high" | null;
  quizNightlife: number; // 0-10
  // From behavioral signals
  viewedListingIds: string[];
  savedListingIds: string[];
  contactedListingIds: string[];
  dismissedListingIds: string[];
  // Computed from behavior
  inferredZones: Record<string, number>; // zone → frequency
  inferredPriceRange: { min: number; max: number };
  lastUpdated: string;
}

export interface ListingMatch {
  listingId: string;
  listingTitle: string;
  matchScore: number; // 0-100
  matchReasons: MatchReason[];
  zone: string;
  price: number;
  type: string;
}

export interface MatchReason {
  factor: string;
  score: number;
  label: string;
}

export const preferenceStore = new InMemoryStore<UserPreferenceVector>();

// Seed preference data for demo users
preferenceStore.seed([
  {
    id: "pref-student-1",
    userId: "user-student-1",
    preferredZones: ["Campus", "Centro"],
    budgetMin: 250,
    budgetMax: 400,
    preferredTypes: ["stanza singola"],
    quizNoise: "moderate",
    quizStudentDensity: "high",
    quizNightlife: 6,
    viewedListingIds: ["via-colombo-21-singola", "piazzale-vittoria-6-doppia", "via-cesare-battisti-14-singola"],
    savedListingIds: ["via-colombo-21-singola"],
    contactedListingIds: ["via-colombo-21-singola"],
    dismissedListingIds: [],
    inferredZones: { Campus: 3, Centro: 2, "San Benedetto": 1 },
    inferredPriceRange: { min: 300, max: 400 },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "pref-student-2",
    userId: "user-student-2",
    preferredZones: ["Stazione", "Centro"],
    budgetMin: 300,
    budgetMax: 750,
    preferredTypes: ["bilocale", "monolocale"],
    quizNoise: "quiet",
    quizStudentDensity: "medium",
    quizNightlife: 3,
    viewedListingIds: ["viale-roma-48-bilocale", "corso-repubblica-112-monolocale"],
    savedListingIds: ["viale-roma-48-bilocale"],
    contactedListingIds: ["viale-roma-48-bilocale"],
    dismissedListingIds: [],
    inferredZones: { Stazione: 2, Centro: 1 },
    inferredPriceRange: { min: 550, max: 800 },
    lastUpdated: new Date().toISOString(),
  },
]);

// Matching algorithm
export function computeListingMatch(
  pref: UserPreferenceVector,
  listing: { id: string; title: string; zone: string; price: number; type: string; size: number; furnished: boolean; verified: boolean }
): ListingMatch {
  const reasons: MatchReason[] = [];
  let totalScore = 0;

  // Price fit (25%)
  const priceInBudget = listing.price >= pref.budgetMin && listing.price <= pref.budgetMax;
  const priceFit = priceInBudget ? 100 : listing.price < pref.budgetMin ? 80 : Math.max(0, 100 - ((listing.price - pref.budgetMax) / pref.budgetMax) * 200);
  const priceScore = Math.round(priceFit * 0.25);
  totalScore += priceScore;
  reasons.push({ factor: "price", score: priceScore, label: priceInBudget ? "Nel tuo budget" : listing.price > pref.budgetMax ? "Sopra budget" : "Sotto budget" });

  // Zone preference (20%)
  const zoneMatch = pref.preferredZones.includes(listing.zone);
  const zoneInferred = (pref.inferredZones[listing.zone] || 0) > 0;
  const zoneScore = Math.round((zoneMatch ? 100 : zoneInferred ? 60 : 20) * 0.2);
  totalScore += zoneScore;
  reasons.push({ factor: "zone", score: zoneScore, label: zoneMatch ? "Zona preferita" : zoneInferred ? "Zona di interesse" : "Zona nuova da esplorare" });

  // Type match (20%)
  const typeMatch = pref.preferredTypes.includes(listing.type);
  const typeScore = Math.round((typeMatch ? 100 : 30) * 0.2);
  totalScore += typeScore;
  reasons.push({ factor: "type", score: typeScore, label: typeMatch ? "Tipo preferito" : "Tipo diverso" });

  // Availability match (15%)
  const notDismissed = !pref.dismissedListingIds.includes(listing.id);
  const alreadySaved = pref.savedListingIds.includes(listing.id);
  const availScore = Math.round((alreadySaved ? 100 : notDismissed ? 70 : 10) * 0.15);
  totalScore += availScore;
  reasons.push({ factor: "availability", score: availScore, label: alreadySaved ? "Già salvato" : "Disponibile" });

  // Landlord reputation (10%)
  const repScore = Math.round((listing.verified ? 100 : 50) * 0.1);
  totalScore += repScore;
  reasons.push({ factor: "reputation", score: repScore, label: listing.verified ? "Proprietario verificato" : "Da verificare" });

  // Social proof (10%)
  const socialScore = Math.round(70 * 0.1);
  totalScore += socialScore;
  reasons.push({ factor: "social", score: socialScore, label: "Popolare nella tua zona" });

  return {
    listingId: listing.id,
    listingTitle: listing.title,
    matchScore: Math.min(100, totalScore),
    matchReasons: reasons,
    zone: listing.zone,
    price: listing.price,
    type: listing.type,
  };
}

export function trackBehavior(
  pref: UserPreferenceVector,
  action: "view" | "save" | "contact" | "dismiss",
  listingId: string,
  listingZone?: string
): UserPreferenceVector {
  const updated = { ...pref, lastUpdated: new Date().toISOString() };

  switch (action) {
    case "view":
      if (!updated.viewedListingIds.includes(listingId)) {
        updated.viewedListingIds = [...updated.viewedListingIds, listingId];
      }
      break;
    case "save":
      if (!updated.savedListingIds.includes(listingId)) {
        updated.savedListingIds = [...updated.savedListingIds, listingId];
      }
      break;
    case "contact":
      if (!updated.contactedListingIds.includes(listingId)) {
        updated.contactedListingIds = [...updated.contactedListingIds, listingId];
      }
      break;
    case "dismiss":
      if (!updated.dismissedListingIds.includes(listingId)) {
        updated.dismissedListingIds = [...updated.dismissedListingIds, listingId];
      }
      break;
  }

  // Update inferred zones
  if (listingZone && action !== "dismiss") {
    updated.inferredZones = { ...updated.inferredZones };
    updated.inferredZones[listingZone] = (updated.inferredZones[listingZone] || 0) + 1;
  }

  return updated;
}
