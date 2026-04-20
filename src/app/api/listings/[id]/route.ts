import { getListingById } from "@/lib/data";

interface ListingRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: ListingRouteContext) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return Response.json({ message: "Annuncio non trovato" }, { status: 404 });
  }

  return Response.json(listing);
}
