import { getCurrentUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { listingStore } from "@/lib/data";
import { conversationStore } from "@/lib/stores";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "landlord" && user.role !== "admin")) {
    return apiError("Unauthorized", { status: 401 });
  }

  const [allListings, conversations] = await Promise.all([
    listingStore.findAll(),
    conversationStore.findAll(),
  ]);
  const listings = allListings.filter(
    (listing) => user.role === "admin" || listing.landlord.email === user.email,
  );

  const data = listings.map((listing) => {
    const inquiries = conversations.filter((conversation) => conversation.listingId === listing.id).length;
    const views = inquiries * 18 + (listing.verified ? 120 : 60);
    const saves = Math.max(0, Math.round(inquiries * 1.5));
    const conversionRate = views > 0 ? Number(((inquiries / views) * 100).toFixed(1)) : 0;

    return {
      listingId: listing.id,
      title: listing.title,
      views,
      saves,
      inquiries,
      conversionRate,
      timeOnMarket: Math.max(3, Math.round(views / 24)),
      priceCompetitiveness: listing.verified ? 92 : 84,
      occupancyRate: listing.status === "Disponibile" ? 72 : 100,
      status: listing.status === "Disponibile" ? "active" : "negotiation",
    };
  });

  return apiSuccess(data, { meta: { actorRole: user.role } });
}
