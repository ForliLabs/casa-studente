import { InMemoryStore } from "@/lib/db";

// ============ PREDICTIVE PRICING ENGINE ============

export type PriceBadge = "good_deal" | "fair_price" | "above_market";

export interface PriceDataPoint {
  id: string;
  listingId: string;
  zone: string;
  type: string;
  price: number;
  pricePerSqm: number;
  size: number;
  furnished: boolean;
  floor: string;
  timestamp: string;
}

export interface ZonePriceStats {
  zone: string;
  type: string;
  median: number;
  p25: number;
  p75: number;
  count: number;
  avgPricePerSqm: number;
  lastUpdated: string;
}

export interface PriceEstimate {
  estimatedPrice: number;
  confidenceMin: number;
  confidenceMax: number;
  badge: PriceBadge;
  comparableCount: number;
  factors: PriceFactor[];
}

export interface PriceFactor {
  name: string;
  weight: number;
  value: number;
  impact: "positive" | "negative" | "neutral";
}

export interface PriceTrend {
  id: string;
  zone: string;
  type: string;
  month: string;
  medianPrice: number;
  avgPrice: number;
  listingCount: number;
}

export const priceDataStore = new InMemoryStore<PriceDataPoint>();
export const priceTrendStore = new InMemoryStore<PriceTrend>();

// Seed historical price data
priceDataStore.seed([
  { id: "pd-1", listingId: "via-colombo-21-singola", zone: "Campus", type: "stanza singola", price: 360, pricePerSqm: 20, size: 18, furnished: true, floor: "2° piano", timestamp: new Date(Date.now() - 90 * 86400000).toISOString() },
  { id: "pd-2", listingId: "viale-roma-48-bilocale", zone: "Stazione", type: "bilocale", price: 750, pricePerSqm: 14.4, size: 52, furnished: true, floor: "1° piano", timestamp: new Date(Date.now() - 60 * 86400000).toISOString() },
  { id: "pd-3", listingId: "corso-repubblica-112-monolocale", zone: "Centro", type: "monolocale", price: 620, pricePerSqm: 20, size: 31, furnished: true, floor: "3° piano", timestamp: new Date(Date.now() - 45 * 86400000).toISOString() },
  { id: "pd-4", listingId: "piazzale-vittoria-6-doppia", zone: "Centro", type: "stanza doppia", price: 300, pricePerSqm: 12.5, size: 24, furnished: true, floor: "Piano rialzato", timestamp: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: "pd-5", listingId: "via-cesare-battisti-14-singola", zone: "San Benedetto", type: "stanza singola", price: 380, pricePerSqm: 19, size: 20, furnished: true, floor: "1° piano", timestamp: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: "pd-6", listingId: "via-giorgio-regnoli-33-monolocale", zone: "Centro", type: "monolocale", price: 580, pricePerSqm: 20.7, size: 28, furnished: true, floor: "2° piano", timestamp: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: "pd-7", listingId: "via-ravegnana-84-bilocale", zone: "Cava", type: "bilocale", price: 680, pricePerSqm: 14.9, size: 46, furnished: true, floor: "2° piano", timestamp: new Date(Date.now() - 10 * 86400000).toISOString() },
]);

// Seed price trends (monthly)
priceTrendStore.seed([
  { id: "trend-1", zone: "Centro", type: "monolocale", month: "2026-01", medianPrice: 580, avgPrice: 595, listingCount: 12 },
  { id: "trend-2", zone: "Centro", type: "monolocale", month: "2026-02", medianPrice: 590, avgPrice: 600, listingCount: 14 },
  { id: "trend-3", zone: "Centro", type: "monolocale", month: "2026-03", medianPrice: 600, avgPrice: 610, listingCount: 15 },
  { id: "trend-4", zone: "Centro", type: "monolocale", month: "2026-04", medianPrice: 610, avgPrice: 615, listingCount: 13 },
  { id: "trend-5", zone: "Centro", type: "monolocale", month: "2026-05", medianPrice: 620, avgPrice: 625, listingCount: 16 },
  { id: "trend-6", zone: "Centro", type: "monolocale", month: "2026-06", medianPrice: 630, avgPrice: 640, listingCount: 18 },
  { id: "trend-7", zone: "Campus", type: "stanza singola", month: "2026-01", medianPrice: 340, avgPrice: 345, listingCount: 20 },
  { id: "trend-8", zone: "Campus", type: "stanza singola", month: "2026-02", medianPrice: 345, avgPrice: 350, listingCount: 22 },
  { id: "trend-9", zone: "Campus", type: "stanza singola", month: "2026-03", medianPrice: 350, avgPrice: 355, listingCount: 24 },
  { id: "trend-10", zone: "Campus", type: "stanza singola", month: "2026-04", medianPrice: 355, avgPrice: 358, listingCount: 21 },
  { id: "trend-11", zone: "Campus", type: "stanza singola", month: "2026-05", medianPrice: 358, avgPrice: 360, listingCount: 25 },
  { id: "trend-12", zone: "Campus", type: "stanza singola", month: "2026-06", medianPrice: 360, avgPrice: 365, listingCount: 28 },
  { id: "trend-13", zone: "Stazione", type: "bilocale", month: "2026-01", medianPrice: 700, avgPrice: 710, listingCount: 8 },
  { id: "trend-14", zone: "Stazione", type: "bilocale", month: "2026-06", medianPrice: 740, avgPrice: 750, listingCount: 10 },
  { id: "trend-15", zone: "Cava", type: "bilocale", month: "2026-01", medianPrice: 640, avgPrice: 650, listingCount: 6 },
  { id: "trend-16", zone: "Cava", type: "bilocale", month: "2026-06", medianPrice: 670, avgPrice: 680, listingCount: 8 },
]);

// Zone desirability scores (from neighborhood intelligence data)
const ZONE_DESIRABILITY: Record<string, number> = {
  Centro: 0.9,
  Campus: 0.85,
  Stazione: 0.75,
  "San Benedetto": 0.7,
  Cava: 0.65,
  Ronco: 0.6,
};

// Seasonal demand multipliers (academic calendar driven)
function getSeasonalMultiplier(): number {
  const month = new Date().getMonth();
  // High demand: Jul-Sep (pre-semester), Jan (mid-year)
  if (month >= 6 && month <= 8) return 1.15;
  if (month === 0) return 1.08;
  // Low demand: Nov-Dec, Apr-May
  if (month >= 10 || (month >= 3 && month <= 4)) return 0.92;
  return 1.0;
}

export function estimatePrice(params: {
  zone: string;
  type: string;
  size: number;
  furnished: boolean;
  floor: string;
  features?: string[];
}): PriceEstimate {
  const { zone, type, size, furnished, floor } = params;

  // Base price estimation by type
  const basePrices: Record<string, number> = {
    "stanza singola": 350,
    "stanza doppia": 280,
    monolocale: 580,
    bilocale: 700,
  };
  let basePrice = basePrices[type] || 400;

  const factors: PriceFactor[] = [];

  // Zone desirability (25%)
  const zoneScore = ZONE_DESIRABILITY[zone] || 0.7;
  const zoneImpact = (zoneScore - 0.75) * 0.25;
  basePrice *= 1 + zoneImpact;
  factors.push({
    name: "Zona",
    weight: 25,
    value: Math.round(zoneScore * 100),
    impact: zoneScore > 0.75 ? "positive" : zoneScore < 0.7 ? "negative" : "neutral",
  });

  // Size adjustment (20%)
  const avgSizes: Record<string, number> = { "stanza singola": 16, "stanza doppia": 22, monolocale: 30, bilocale: 50 };
  const sizeRatio = size / (avgSizes[type] || 25);
  basePrice *= 0.8 + sizeRatio * 0.2;
  factors.push({
    name: "Dimensione",
    weight: 20,
    value: Math.round(sizeRatio * 100),
    impact: sizeRatio > 1.1 ? "positive" : sizeRatio < 0.9 ? "negative" : "neutral",
  });

  // Furnished bonus (10%)
  if (furnished) {
    basePrice *= 1.08;
    factors.push({ name: "Arredato", weight: 10, value: 100, impact: "positive" });
  } else {
    factors.push({ name: "Non arredato", weight: 10, value: 0, impact: "negative" });
  }

  // Floor adjustment (10%)
  const floorNum = parseInt(floor) || 0;
  const floorBonus = floorNum > 0 ? Math.min(floorNum * 0.02, 0.06) : -0.02;
  basePrice *= 1 + floorBonus;
  factors.push({
    name: "Piano",
    weight: 10,
    value: floorNum,
    impact: floorNum >= 2 ? "positive" : floorNum === 0 ? "negative" : "neutral",
  });

  // Seasonal demand (10%)
  const seasonal = getSeasonalMultiplier();
  basePrice *= seasonal;
  factors.push({
    name: "Domanda stagionale",
    weight: 10,
    value: Math.round(seasonal * 100),
    impact: seasonal > 1.05 ? "positive" : seasonal < 0.95 ? "negative" : "neutral",
  });

  const estimatedPrice = Math.round(basePrice / 5) * 5; // Round to nearest 5
  const confidence = 0.12; // ±12% confidence
  const confidenceMin = Math.round(estimatedPrice * (1 - confidence));
  const confidenceMax = Math.round(estimatedPrice * (1 + confidence));

  return {
    estimatedPrice,
    confidenceMin,
    confidenceMax,
    badge: "fair_price", // placeholder — actual badge set by comparing with listing price
    comparableCount: 7,
    factors,
  };
}

export function getPriceBadge(actualPrice: number, estimatedPrice: number): PriceBadge {
  const ratio = actualPrice / estimatedPrice;
  if (ratio <= 0.92) return "good_deal";
  if (ratio >= 1.12) return "above_market";
  return "fair_price";
}

export function getZoneStats(zone: string, type: string): ZonePriceStats {
  // Aggregated stats for a zone/type combo
  const stats: Record<string, Record<string, ZonePriceStats>> = {
    Centro: {
      monolocale: { zone: "Centro", type: "monolocale", median: 620, p25: 560, p75: 680, count: 16, avgPricePerSqm: 20.5, lastUpdated: new Date().toISOString() },
      "stanza singola": { zone: "Centro", type: "stanza singola", median: 380, p25: 340, p75: 420, count: 12, avgPricePerSqm: 21, lastUpdated: new Date().toISOString() },
      "stanza doppia": { zone: "Centro", type: "stanza doppia", median: 300, p25: 270, p75: 330, count: 8, avgPricePerSqm: 13, lastUpdated: new Date().toISOString() },
      bilocale: { zone: "Centro", type: "bilocale", median: 780, p25: 720, p75: 850, count: 6, avgPricePerSqm: 15.5, lastUpdated: new Date().toISOString() },
    },
    Campus: {
      "stanza singola": { zone: "Campus", type: "stanza singola", median: 360, p25: 320, p75: 400, count: 28, avgPricePerSqm: 19.5, lastUpdated: new Date().toISOString() },
      "stanza doppia": { zone: "Campus", type: "stanza doppia", median: 280, p25: 250, p75: 310, count: 15, avgPricePerSqm: 12.5, lastUpdated: new Date().toISOString() },
      monolocale: { zone: "Campus", type: "monolocale", median: 550, p25: 500, p75: 600, count: 8, avgPricePerSqm: 19, lastUpdated: new Date().toISOString() },
    },
    Stazione: {
      bilocale: { zone: "Stazione", type: "bilocale", median: 740, p25: 680, p75: 800, count: 10, avgPricePerSqm: 14.5, lastUpdated: new Date().toISOString() },
      "stanza singola": { zone: "Stazione", type: "stanza singola", median: 350, p25: 310, p75: 390, count: 14, avgPricePerSqm: 18, lastUpdated: new Date().toISOString() },
    },
    Cava: {
      bilocale: { zone: "Cava", type: "bilocale", median: 670, p25: 620, p75: 720, count: 8, avgPricePerSqm: 14, lastUpdated: new Date().toISOString() },
    },
    "San Benedetto": {
      "stanza singola": { zone: "San Benedetto", type: "stanza singola", median: 370, p25: 330, p75: 410, count: 10, avgPricePerSqm: 18.5, lastUpdated: new Date().toISOString() },
    },
  };

  return stats[zone]?.[type] || {
    zone,
    type,
    median: 400,
    p25: 350,
    p75: 450,
    count: 0,
    avgPricePerSqm: 15,
    lastUpdated: new Date().toISOString(),
  };
}
