import { InMemoryStore } from "@/lib/db";

// ============ ANALYTICS & INSIGHTS ENGINE ============

export type AnalyticsEventType =
  | "listing_viewed"
  | "listing_saved"
  | "listing_contacted"
  | "search_executed"
  | "journey_advanced"
  | "payment_made"
  | "review_submitted"
  | "message_sent"
  | "tour_booked"
  | "document_uploaded"
  | "profile_updated";

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: AnalyticsEventType;
  entityType: "listing" | "journey" | "payment" | "review" | "message" | "tour" | "document" | "search";
  entityId: string;
  metadata: Record<string, string | number>;
  timestamp: string;
}

export interface LandlordInsight {
  listingId: string;
  listingTitle: string;
  views: number;
  saves: number;
  inquiries: number;
  conversionRate: number;
  avgResponseTime: string;
  timeOnMarket: number;
  priceCompetitiveness: "below" | "market" | "above";
  suggestions: string[];
}

export interface PlatformMetrics {
  totalUsers: number;
  totalListings: number;
  activeJourneys: number;
  completedLeases: number;
  avgTimeToLease: number;
  supplyDemandRatio: Record<string, number>;
  conversionFunnel: { stage: string; count: number; rate: number }[];
  monthlyRevenue: number;
}

export const analyticsEventStore = new InMemoryStore<AnalyticsEvent>();

// Seed analytics events
analyticsEventStore.seed([
  { id: "ae-1", userId: "user-student-1", eventType: "listing_viewed", entityType: "listing", entityId: "via-colombo-21-singola", metadata: { zone: "Campus", source: "search" }, timestamp: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: "ae-2", userId: "user-student-1", eventType: "listing_saved", entityType: "listing", entityId: "via-colombo-21-singola", metadata: { zone: "Campus" }, timestamp: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: "ae-3", userId: "user-student-1", eventType: "listing_contacted", entityType: "listing", entityId: "via-colombo-21-singola", metadata: { zone: "Campus" }, timestamp: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: "ae-4", userId: "user-student-2", eventType: "listing_viewed", entityType: "listing", entityId: "viale-roma-48-bilocale", metadata: { zone: "Stazione", source: "browse" }, timestamp: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: "ae-5", userId: "user-student-2", eventType: "listing_contacted", entityType: "listing", entityId: "viale-roma-48-bilocale", metadata: { zone: "Stazione" }, timestamp: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "ae-6", userId: "user-student-3", eventType: "listing_viewed", entityType: "listing", entityId: "corso-repubblica-112-monolocale", metadata: { zone: "Centro", source: "recommendation" }, timestamp: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: "ae-7", userId: "user-student-1", eventType: "journey_advanced", entityType: "journey", entityId: "journey-1", metadata: { fromStage: "lease_signed", toStage: "active_tenancy" }, timestamp: new Date(Date.now() - 35 * 86400000).toISOString() },
  { id: "ae-8", userId: "user-student-1", eventType: "payment_made", entityType: "payment", entityId: "pay-1", metadata: { amount: 360, type: "rent" }, timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "ae-9", userId: "user-student-1", eventType: "review_submitted", entityType: "review", entityId: "review-1", metadata: { rating: 5 }, timestamp: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: "ae-10", userId: "user-student-1", eventType: "search_executed", entityType: "search", entityId: "search-1", metadata: { zone: "Centro", type: "monolocale", resultsCount: 3 }, timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "ae-11", userId: "user-student-3", eventType: "listing_viewed", entityType: "listing", entityId: "via-colombo-21-singola", metadata: { zone: "Campus" }, timestamp: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "ae-12", userId: "user-student-4", eventType: "listing_viewed", entityType: "listing", entityId: "via-colombo-21-singola", metadata: { zone: "Campus" }, timestamp: new Date(Date.now() - 86400000).toISOString() },
]);

export async function emitEvent(
  userId: string,
  eventType: AnalyticsEventType,
  entityType: AnalyticsEvent["entityType"],
  entityId: string,
  metadata: Record<string, string | number> = {}
): Promise<void> {
  const event: AnalyticsEvent = {
    id: `ae-${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    eventType,
    entityType,
    entityId,
    metadata,
    timestamp: new Date().toISOString(),
  };
  await analyticsEventStore.create(event);
}

export async function getListingAnalytics(listingId: string): Promise<{
  views: number;
  saves: number;
  contacts: number;
  conversionRate: number;
}> {
  const events = await analyticsEventStore.filter((e) => e.entityId === listingId);
  const views = events.filter((e) => e.eventType === "listing_viewed").length;
  const saves = events.filter((e) => e.eventType === "listing_saved").length;
  const contacts = events.filter((e) => e.eventType === "listing_contacted").length;

  return {
    views,
    saves,
    contacts,
    conversionRate: views > 0 ? Math.round((contacts / views) * 100) : 0,
  };
}

export async function getLandlordInsights(landlordListingIds: string[]): Promise<LandlordInsight[]> {
  const insights: LandlordInsight[] = [];

  for (const listingId of landlordListingIds) {
    const stats = await getListingAnalytics(listingId);
    const suggestions: string[] = [];

    if (stats.views < 5) suggestions.push("Aggiungi più foto per aumentare le visualizzazioni");
    if (stats.conversionRate < 10) suggestions.push("Migliora la descrizione per aumentare le richieste");
    if (stats.saves > 3 && stats.contacts === 0) suggestions.push("Molti salvataggi ma poche richieste — considera di abbassare il prezzo");

    insights.push({
      listingId,
      listingTitle: listingId,
      views: stats.views,
      saves: stats.saves,
      inquiries: stats.contacts,
      conversionRate: stats.conversionRate,
      avgResponseTime: "< 2 ore",
      timeOnMarket: 14,
      priceCompetitiveness: "market",
      suggestions,
    });
  }

  return insights;
}

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const events = await analyticsEventStore.findAll();

  const uniqueUsers = new Set(events.map((e) => e.userId)).size;
  const journeyEvents = events.filter((e) => e.eventType === "journey_advanced");
  const paymentEvents = events.filter((e) => e.eventType === "payment_made");
  const revenue = paymentEvents.reduce((sum, e) => sum + (Number(e.metadata.amount) || 0), 0);

  // Supply-demand by zone
  const searchesByZone: Record<string, number> = {};
  events
    .filter((e) => e.eventType === "search_executed" || e.eventType === "listing_viewed")
    .forEach((e) => {
      const zone = String(e.metadata.zone || "Unknown");
      searchesByZone[zone] = (searchesByZone[zone] || 0) + 1;
    });

  return {
    totalUsers: uniqueUsers,
    totalListings: 7,
    activeJourneys: 2,
    completedLeases: 1,
    avgTimeToLease: 55,
    supplyDemandRatio: searchesByZone,
    conversionFunnel: [
      { stage: "Visualizzazione", count: events.filter((e) => e.eventType === "listing_viewed").length, rate: 100 },
      { stage: "Salvataggio", count: events.filter((e) => e.eventType === "listing_saved").length, rate: 25 },
      { stage: "Contatto", count: events.filter((e) => e.eventType === "listing_contacted").length, rate: 15 },
      { stage: "Candidatura", count: journeyEvents.length, rate: 8 },
      { stage: "Contratto", count: 1, rate: 5 },
    ],
    monthlyRevenue: revenue * 0.05, // 5% platform fee
  };
}
