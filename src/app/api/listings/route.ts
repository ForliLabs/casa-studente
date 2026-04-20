import { getAllListings } from "@/lib/data";

export async function GET() {
  const listings = await getAllListings();
  return Response.json(listings);
}
