import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import { conversationStore } from "@/lib/stores";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "landlord" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listings = (await listingStore.findAll()).filter(
    (listing) => user.role === "admin" || listing.landlord.email === user.email,
  );
  const conversations = await conversationStore.findAll();

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

  return NextResponse.json({ data, generatedAt: new Date().toISOString() });
}
