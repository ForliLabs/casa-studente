import { describe, expect, it } from "vitest";
import { listings } from "@/lib/data";
import {
  applyListingFilters,
  getBudgetFilterFromQuiz,
  parseListingFiltersFromSearchParams,
  sortListings,
} from "@/lib/listings-search";

describe("listings-search helpers", () => {
  it("filters listings by zone, price, and tour availability", () => {
    const result = applyListingFilters(listings, {
      zone: "Campus",
      maxPrice: 400,
      virtualTourOnly: true,
    });

    expect(result.map((listing) => listing.id)).toEqual(["via-colombo-21-singola"]);
  });

  it("sorts listings by ascending price", () => {
    const result = sortListings(listings, "price-asc");
    expect(result[0]?.price).toBeLessThanOrEqual(result[1]?.price ?? Number.MAX_SAFE_INTEGER);
  });

  it("parses search params into filters", () => {
    const params = new URLSearchParams("zone=Centro&maxPrice=600&verified=1&sort=price-desc");
    const result = parseListingFiltersFromSearchParams(params);

    expect(result.zone).toBe("Centro");
    expect(result.maxPrice).toBe(600);
    expect(result.verifiedOnly).toBe(true);
    expect(result.sort).toBe("price-desc");
  });

  it("maps quiz answers to budget filters", () => {
    expect(getBudgetFilterFromQuiz("low")).toEqual({ maxPrice: 350 });
    expect(getBudgetFilterFromQuiz("medium")).toEqual({ minPrice: 350, maxPrice: 500 });
  });
});
