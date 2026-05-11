import { apiSuccess } from "@/lib/api-response";
import { getAllListings } from "@/lib/data";
import { applyListingFilters, parseListingFiltersFromSearchParams, sortListings } from "@/lib/listings-search";

export async function GET(request: Request) {
  const listings = await getAllListings();
  const { sort, ...filters } = parseListingFiltersFromSearchParams(new URL(request.url).searchParams);
  const filtered = sortListings(applyListingFilters(listings, filters), sort);

  return apiSuccess(filtered, {
    meta: {
      filters,
      sort,
      totalAvailable: listings.length,
    },
  });
}
