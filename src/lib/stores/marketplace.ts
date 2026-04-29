import { InMemoryStore } from "@/lib/db";

// ============ MARKETPLACE HEALTH & SUPPLY TOOLS ============

export interface ListingQualityScore {
  id: string;
  listingId: string;
  photoScore: number;      // 0-10 (based on count, variety)
  descriptionScore: number; // 0-10 (length, completeness, bilingual)
  featureScore: number;    // 0-10 (% of fields filled)
  priceScore: number;      // 0-10 (competitiveness)
  reputationScore: number; // 0-10 (landlord reputation)
  overallScore: number;    // weighted average
  suggestions: string[];
  computedAt: string;
}

export interface BulkImportJob {
  id: string;
  userId: string;
  status: "pending" | "validating" | "importing" | "completed" | "failed";
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  errors: { row: number; field: string; message: string }[];
  createdAt: string;
  completedAt?: string;
}

export interface SupplyDemandMetric {
  id: string;
  zone: string;
  activeListings: number;
  activeSearchers: number;
  ratio: number; // demand / supply
  gap: "surplus" | "balanced" | "deficit";
  avgPrice: number;
  avgDaysOnMarket: number;
  lastUpdated: string;
}

export interface LandlordReferral {
  id: string;
  referrerId: string;
  referrerName: string;
  referralCode: string;
  referredEmail?: string;
  referredName?: string;
  status: "pending" | "registered" | "listing_published" | "rewarded";
  rewardType: "fee_reduction";
  rewardValue: number; // percentage reduction
  createdAt: string;
  convertedAt?: string;
}

export interface VacancyCost {
  listingId: string;
  monthlyRent: number;
  utilityCost: number;
  daysVacant: number;
  totalLostRent: number;
  totalUtilityCost: number;
  totalCost: number;
}

export const qualityScoreStore = new InMemoryStore<ListingQualityScore>();
export const bulkImportStore = new InMemoryStore<BulkImportJob>();
export const supplyDemandStore = new InMemoryStore<SupplyDemandMetric>();
export const landlordReferralStore = new InMemoryStore<LandlordReferral>();

// Seed quality scores
qualityScoreStore.seed([
  {
    id: "qs-1", listingId: "via-colombo-21-singola",
    photoScore: 6, descriptionScore: 8, featureScore: 9, priceScore: 8, reputationScore: 9.4,
    overallScore: 8.1, suggestions: ["Aggiungi 2 foto in più per raggiungere il livello 'Eccellente'"], computedAt: new Date().toISOString(),
  },
  {
    id: "qs-2", listingId: "viale-roma-48-bilocale",
    photoScore: 6, descriptionScore: 7, featureScore: 8, priceScore: 7, reputationScore: 8.2,
    overallScore: 7.2, suggestions: ["Aggiungi una descrizione in inglese", "Aggiungi foto del bagno"], computedAt: new Date().toISOString(),
  },
  {
    id: "qs-3", listingId: "corso-repubblica-112-monolocale",
    photoScore: 6, descriptionScore: 7, featureScore: 7, priceScore: 6, reputationScore: 7.0,
    overallScore: 6.6, suggestions: ["Il prezzo è sopra la media di zona", "Aggiungi foto degli esterni", "Specifica la politica sulle utenze in modo più chiaro"], computedAt: new Date().toISOString(),
  },
]);

// Seed supply-demand metrics
supplyDemandStore.seed([
  { id: "sd-1", zone: "Centro", activeListings: 12, activeSearchers: 45, ratio: 3.75, gap: "deficit", avgPrice: 520, avgDaysOnMarket: 8, lastUpdated: new Date().toISOString() },
  { id: "sd-2", zone: "Campus", activeListings: 18, activeSearchers: 38, ratio: 2.1, gap: "deficit", avgPrice: 360, avgDaysOnMarket: 5, lastUpdated: new Date().toISOString() },
  { id: "sd-3", zone: "Stazione", activeListings: 10, activeSearchers: 14, ratio: 1.4, gap: "balanced", avgPrice: 680, avgDaysOnMarket: 14, lastUpdated: new Date().toISOString() },
  { id: "sd-4", zone: "Cava", activeListings: 8, activeSearchers: 6, ratio: 0.75, gap: "surplus", avgPrice: 580, avgDaysOnMarket: 22, lastUpdated: new Date().toISOString() },
  { id: "sd-5", zone: "San Benedetto", activeListings: 6, activeSearchers: 10, ratio: 1.67, gap: "deficit", avgPrice: 400, avgDaysOnMarket: 12, lastUpdated: new Date().toISOString() },
]);

// Seed referrals
landlordReferralStore.seed([
  {
    id: "ref-1", referrerId: "user-landlord-1", referrerName: "Elena Rossi",
    referralCode: "ELENA-CS2026", referredName: "Paolo Verdi", referredEmail: "paolo.verdi@email.it",
    status: "listing_published", rewardType: "fee_reduction", rewardValue: 2,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), convertedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "ref-2", referrerId: "user-landlord-1", referrerName: "Elena Rossi",
    referralCode: "ELENA-CS2026",
    status: "pending", rewardType: "fee_reduction", rewardValue: 2,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]);

export function computeListingQuality(listing: {
  photos: string[];
  description: string;
  features: string[];
  price: number;
  zone: string;
  type: string;
}): ListingQualityScore {
  const suggestions: string[] = [];

  // Photo score
  const photoCount = listing.photos.length;
  const photoScore = Math.min(10, photoCount * 2);
  if (photoCount < 5) suggestions.push(`Aggiungi ${5 - photoCount} foto in più per raggiungere il livello 'Eccellente'`);

  // Description score
  const descLen = listing.description.length;
  const descriptionScore = Math.min(10, Math.round(descLen / 30));
  if (descLen < 100) suggestions.push("Scrivi una descrizione più dettagliata (almeno 100 caratteri)");

  // Feature score
  const featureScore = Math.min(10, listing.features.length * 2.5);
  if (listing.features.length < 4) suggestions.push("Aggiungi più caratteristiche (WiFi, arredamento, ecc.)");

  // Price score (simplified)
  const priceScore = 7;

  // Reputation score (placeholder)
  const reputationScore = 7;

  const overallScore = Math.round(
    (photoScore * 0.25 + descriptionScore * 0.2 + featureScore * 0.2 + priceScore * 0.2 + reputationScore * 0.15) * 10
  ) / 10;

  return {
    id: `qs-${Date.now().toString(36)}`,
    listingId: "",
    photoScore,
    descriptionScore,
    featureScore,
    priceScore,
    reputationScore,
    overallScore,
    suggestions,
    computedAt: new Date().toISOString(),
  };
}

export function calculateVacancyCost(monthlyRent: number, utilityCost: number, daysVacant: number): VacancyCost {
  const dailyRent = monthlyRent / 30;
  const dailyUtility = utilityCost / 30;

  return {
    listingId: "",
    monthlyRent,
    utilityCost,
    daysVacant,
    totalLostRent: Math.round(dailyRent * daysVacant),
    totalUtilityCost: Math.round(dailyUtility * daysVacant),
    totalCost: Math.round((dailyRent + dailyUtility) * daysVacant),
  };
}
