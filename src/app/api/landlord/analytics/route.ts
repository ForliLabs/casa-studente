import { NextResponse } from "next/server";

// Landlord API endpoint — analytics summary
export async function GET() {
  const analytics = {
    totalViews: 342,
    totalInquiries: 12,
    totalSaves: 28,
    overallConversionRate: 3.5,
    averageResponseTime: "1.5 hours",
    revenueThisMonth: 450,
    occupancyRate: 95,
    competitivenessIndex: 92,
  };

  return NextResponse.json({ data: analytics, generatedAt: new Date().toISOString() });
}
