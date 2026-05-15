import { describe, expect, it } from "vitest";
import { listings } from "@/lib/data";
import {
  applyListingFilters,
  getBudgetFilterFromQuiz,
  getRecommendedListings,
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
    const params = new URLSearchParams("zone=Centro&maxPrice=600&verified=1&furnished=1&secure=1&sort=best-match");
    const result = parseListingFiltersFromSearchParams(params);

    expect(result.zone).toBe("Centro");
    expect(result.maxPrice).toBe(600);
    expect(result.verifiedOnly).toBe(true);
    expect(result.furnishedOnly).toBe(true);
    expect(result.securePaymentsOnly).toBe(true);
    expect(result.sort).toBe("best-match");
  });

  it("returns AI recommendations ordered by best match", () => {
    const result = getRecommendedListings(listings, {
      zone: "Campus",
      maxPrice: 450,
      virtualTourOnly: true,
      features: ["wifi"],
    });

    expect(result[0]?.listing.id).toBe("via-colombo-21-singola");
    expect(result[0]?.score).toBeGreaterThan(0);
    expect(result[0]?.reasons.join(" ")).toContain("Campus");
  });

  it("supports best-match sorting", () => {
    const result = sortListings(listings, "best-match", {
      zone: "Campus",
      maxPrice: 450,
      virtualTourOnly: true,
    });

    expect(result[0]?.id).toBe("via-colombo-21-singola");
  });

  it("maps quiz answers to budget filters", () => {
    expect(getBudgetFilterFromQuiz("low")).toEqual({ maxPrice: 350 });
    expect(getBudgetFilterFromQuiz("medium")).toEqual({ minPrice: 350, maxPrice: 500 });
  });
});
