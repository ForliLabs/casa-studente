import { describe, it, expect } from "vitest";
import { estimatePrice, getPriceBadge, getZoneStats } from "@/lib/stores/pricing";
import { computeListingMatch, type UserPreferenceVector } from "@/lib/stores/matching";
import { canTransition, getNextStages, type JourneyStage } from "@/lib/stores/journey";
import { computeReputation } from "@/lib/stores/reputation";
import { computeListingQuality, calculateVacancyCost } from "@/lib/stores/marketplace";

describe("Predictive Pricing Engine", () => {
  it("estimates price for a Centro monolocale", () => {
    const estimate = estimatePrice({
      zone: "Centro",
      type: "monolocale",
      size: 30,
      furnished: true,
      floor: "2° piano",
    });
    expect(estimate.estimatedPrice).toBeGreaterThan(400);
    expect(estimate.estimatedPrice).toBeLessThan(900);
    expect(estimate.factors.length).toBeGreaterThan(0);
    expect(estimate.confidenceMin).toBeLessThan(estimate.estimatedPrice);
    expect(estimate.confidenceMax).toBeGreaterThan(estimate.estimatedPrice);
  });

  it("gives higher price for Campus vs Cava", () => {
    const campus = estimatePrice({ zone: "Campus", type: "stanza singola", size: 18, furnished: true, floor: "1° piano" });
    const cava = estimatePrice({ zone: "Cava", type: "stanza singola", size: 18, furnished: true, floor: "1° piano" });
    expect(campus.estimatedPrice).toBeGreaterThan(cava.estimatedPrice);
  });

  it("assigns correct price badges", () => {
    expect(getPriceBadge(300, 400)).toBe("good_deal");
    expect(getPriceBadge(400, 400)).toBe("fair_price");
    expect(getPriceBadge(500, 400)).toBe("above_market");
  });

  it("returns zone stats", () => {
    const stats = getZoneStats("Centro", "monolocale");
    expect(stats.zone).toBe("Centro");
    expect(stats.median).toBeGreaterThan(0);
    expect(stats.p25).toBeLessThan(stats.p75);
  });
});

describe("Smart Matching Engine", () => {
  const pref: UserPreferenceVector = {
    id: "test-pref",
    userId: "user-test",
    preferredZones: ["Centro", "Campus"],
    budgetMin: 300,
    budgetMax: 500,
    preferredTypes: ["stanza singola"],
    quizNoise: "moderate",
    quizStudentDensity: "high",
    quizNightlife: 5,
    viewedListingIds: [],
    savedListingIds: [],
    contactedListingIds: [],
    dismissedListingIds: [],
    inferredZones: { Centro: 3 },
    inferredPriceRange: { min: 300, max: 450 },
    lastUpdated: new Date().toISOString(),
  };

  it("gives high score for matching listing", () => {
    const match = computeListingMatch(pref, {
      id: "test-listing",
      title: "Test",
      zone: "Centro",
      price: 400,
      type: "stanza singola",
      size: 18,
      furnished: true,
      verified: true,
    });
    expect(match.matchScore).toBeGreaterThan(60);
    expect(match.matchReasons.length).toBeGreaterThan(0);
  });

  it("gives lower score for out-of-budget listing", () => {
    const match = computeListingMatch(pref, {
      id: "expensive",
      title: "Expensive",
      zone: "Centro",
      price: 900,
      type: "stanza singola",
      size: 18,
      furnished: true,
      verified: true,
    });
    expect(match.matchScore).toBeLessThan(70);
  });

  it("penalizes dismissed listings", () => {
    const prefWithDismissed = { ...pref, dismissedListingIds: ["dismissed-1"] };
    const match = computeListingMatch(prefWithDismissed, {
      id: "dismissed-1",
      title: "Dismissed",
      zone: "Centro",
      price: 400,
      type: "stanza singola",
      size: 18,
      furnished: true,
      verified: true,
    });
    expect(match.matchScore).toBeLessThan(90);
  });
});

describe("Journey State Machine", () => {
  it("allows valid transitions", () => {
    expect(canTransition("discovered", "contacted")).toBe(true);
    expect(canTransition("contacted", "visiting")).toBe(true);
    expect(canTransition("lease_pending", "lease_signed")).toBe(true);
    expect(canTransition("active_tenancy", "completed")).toBe(true);
  });

  it("blocks invalid transitions", () => {
    expect(canTransition("discovered", "lease_signed")).toBe(false);
    expect(canTransition("completed", "discovered")).toBe(false);
    expect(canTransition("reviewed", "contacted")).toBe(false);
  });

  it("allows cancellation from most stages", () => {
    const cancellable: JourneyStage[] = ["discovered", "contacted", "visiting", "applied", "lease_pending", "lease_signed"];
    cancellable.forEach((stage) => {
      expect(canTransition(stage, "cancelled")).toBe(true);
    });
  });

  it("prevents cancellation of completed/reviewed", () => {
    expect(canTransition("completed", "cancelled")).toBe(false);
    expect(canTransition("reviewed", "cancelled")).toBe(false);
  });

  it("returns next stages correctly", () => {
    const next = getNextStages("contacted");
    expect(next).toContain("visiting");
    expect(next).toContain("applied");
    expect(next).toContain("cancelled");
    expect(next).not.toContain("lease_signed");
  });
});

describe("Landlord Reputation", () => {
  it("computes superhost for excellent scores", () => {
    const result = computeReputation({
      avgReviewScore: 9.5,
      responseTime: 9.0,
      leaseCompletionRate: 10,
      documentCompliance: 10,
      disputeFrequency: 10,
      listingAccuracy: 9,
      completedLeases: 12,
    });
    expect(result.badge).toBe("superhost");
    expect(result.overallScore).toBeGreaterThan(9);
  });

  it("computes affidabile for good scores", () => {
    const result = computeReputation({
      avgReviewScore: 7.5,
      responseTime: 7.0,
      leaseCompletionRate: 8,
      documentCompliance: 8,
      disputeFrequency: 8,
      listingAccuracy: 7,
      completedLeases: 5,
    });
    expect(result.badge).toBe("affidabile");
  });

  it("returns none for new landlords", () => {
    const result = computeReputation({
      avgReviewScore: 8,
      responseTime: 7,
      leaseCompletionRate: 0,
      documentCompliance: 5,
      disputeFrequency: 10,
      listingAccuracy: 5,
      completedLeases: 0,
    });
    expect(result.badge).toBe("none");
  });
});

describe("Listing Quality Score", () => {
  it("scores listings with many photos higher", () => {
    const good = computeListingQuality({
      photos: ["1", "2", "3", "4", "5"],
      description: "A detailed description that is long enough to score well in the quality assessment",
      features: ["WiFi", "AC", "Washing", "Parking"],
      price: 400,
      zone: "Centro",
      type: "stanza singola",
    });
    const bad = computeListingQuality({
      photos: ["1"],
      description: "Short",
      features: ["WiFi"],
      price: 400,
      zone: "Centro",
      type: "stanza singola",
    });
    expect(good.overallScore).toBeGreaterThan(bad.overallScore);
  });

  it("provides improvement suggestions", () => {
    const result = computeListingQuality({
      photos: ["1"],
      description: "Short",
      features: [],
      price: 400,
      zone: "Centro",
      type: "stanza singola",
    });
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});

describe("Vacancy Cost Calculator", () => {
  it("calculates costs correctly", () => {
    const result = calculateVacancyCost(600, 90, 30);
    expect(result.totalLostRent).toBe(600);
    expect(result.totalUtilityCost).toBe(90);
    expect(result.totalCost).toBe(690);
  });

  it("handles partial months", () => {
    const result = calculateVacancyCost(600, 90, 15);
    expect(result.totalLostRent).toBe(300);
    expect(result.totalCost).toBeLessThan(690);
  });
});
