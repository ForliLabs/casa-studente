"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  emitEvent,
  getListingAnalytics,
  getLandlordInsights,
  getPlatformMetrics,
  analyticsEventStore,
  type AnalyticsEventType,
  type AnalyticsEvent,
} from "@/lib/stores/analytics";

export async function trackEventAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const eventType = formData.get("eventType") as AnalyticsEventType;
  const entityType = formData.get("entityType") as AnalyticsEvent["entityType"];
  const entityId = formData.get("entityId") as string;
  const metadataRaw = formData.get("metadata") as string;

  if (!eventType || !entityType || !entityId) return;

  const metadata = metadataRaw ? JSON.parse(metadataRaw) : {};
  await emitEvent(user.id, eventType, entityType, entityId, metadata);
}

export async function getInsightsDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.role === "landlord") {
    // Return landlord-specific insights
    const insights = await getLandlordInsights([
      "via-colombo-21-singola",
      "viale-roma-48-bilocale",
    ]);
    return { type: "landlord" as const, insights };
  }

  if (user.role === "admin") {
    const metrics = await getPlatformMetrics();
    return { type: "admin" as const, metrics };
  }

  // Student insights
  const events = await analyticsEventStore.filter((e) => e.userId === user.id);
  const viewedZones: Record<string, number> = {};
  let totalViewed = 0;
  let avgPrice = 0;
  let priceCount = 0;

  events.forEach((e) => {
    if (e.eventType === "listing_viewed") {
      totalViewed++;
      const zone = String(e.metadata.zone || "Unknown");
      viewedZones[zone] = (viewedZones[zone] || 0) + 1;
    }
    if (e.metadata.price) {
      avgPrice += Number(e.metadata.price);
      priceCount++;
    }
  });

  return {
    type: "student" as const,
    studentInsights: {
      totalViewed,
      topZones: Object.entries(viewedZones)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([zone, count]) => ({ zone, count })),
      avgViewedPrice: priceCount > 0 ? Math.round(avgPrice / priceCount) : null,
      savedCount: events.filter((e) => e.eventType === "listing_saved").length,
      contactedCount: events.filter((e) => e.eventType === "listing_contacted").length,
    },
  };
}
