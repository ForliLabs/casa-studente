import { apiError, apiSuccess } from "@/lib/api-response";
import { getListingById } from "@/lib/data";

interface ListingRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: ListingRouteContext) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return apiError("Annuncio non trovato", { status: 404 });
  }

  return apiSuccess(listing, { meta: { listingId: id } });
}
