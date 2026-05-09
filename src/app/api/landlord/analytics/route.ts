import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import { conversationStore, paymentStore } from "@/lib/stores";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "landlord" && user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listings = (await listingStore.findAll()).filter(
    (listing) => user.role === "admin" || listing.landlord.email === user.email,
  );
  const conversations = await conversationStore.findAll();
  const payments = (await paymentStore.findAll()).filter(
    (payment) => user.role === "admin" || payment.recipientId === user.id,
  );

  const totalInquiries = conversations.filter((conversation) =>
    listings.some((listing) => listing.id === conversation.listingId),
  ).length;
  const totalViews = listings.reduce((sum, listing) => sum + (listing.verified ? 120 : 60), totalInquiries * 18);
  const totalSaves = Math.round(totalInquiries * 1.5);
  const completedRevenue = payments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const analytics = {
    totalViews,
    totalInquiries,
    totalSaves,
    overallConversionRate: totalViews > 0 ? Number(((totalInquiries / totalViews) * 100).toFixed(1)) : 0,
    averageResponseTime: totalInquiries > 0 ? "entro 4 ore" : "nessuna richiesta",
    revenueThisMonth: completedRevenue,
    occupancyRate:
      listings.length > 0
        ? Math.round((listings.filter((listing) => listing.status === "In trattativa").length / listings.length) * 100)
        : 0,
    competitivenessIndex:
      listings.length > 0
        ? Math.round(
            listings.reduce((sum, listing) => sum + (listing.verified ? 92 : 84), 0) / listings.length,
          )
        : 0,
  };

  return NextResponse.json({ data: analytics, generatedAt: new Date().toISOString() });
}
