import { NextResponse } from "next/server";

// Landlord API endpoint — listing performance data
export async function GET() {
  // In production, validate API key from Authorization header
  const listings = [
    {
      listingId: "via-colombo-21-singola",
      title: "Via Cristoforo Colombo 21",
      views: 342,
      saves: 28,
      inquiries: 12,
      conversionRate: 3.5,
      timeOnMarket: 14,
      priceCompetitiveness: 92,
      occupancyRate: 95,
      status: "active",
    },
  ];

  return NextResponse.json({ data: listings, generatedAt: new Date().toISOString() });
}
