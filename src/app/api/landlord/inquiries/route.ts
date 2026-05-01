import { NextResponse } from "next/server";

// Landlord API endpoint — inquiry pipeline
export async function GET() {
  const inquiries = [
    {
      id: "inq-1",
      studentName: "Martina L.",
      listingTitle: "Via Cristoforo Colombo 21",
      status: "responded",
      receivedAt: new Date(Date.now() - 86400000).toISOString(),
      respondedAt: new Date(Date.now() - 82800000).toISOString(),
    },
  ];

  return NextResponse.json({ data: inquiries, generatedAt: new Date().toISOString() });
}
