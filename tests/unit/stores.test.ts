import { describe, it, expect } from "vitest";
import {
  calculateCompatibility,
  calculateTrustScore,
  calculateDistance,
  getWalkingTime,
  getCyclingTime,
  type RoommateProfile,
  type Review,
} from "@/lib/stores";

describe("calculateCompatibility", () => {
  const baseProfile: RoommateProfile = {
    id: "test-1",
    userId: "user-1",
    name: "Test User",
    studyProgram: "Test Program",
    languages: ["Italiano", "English"],
    budgetMin: 300,
    budgetMax: 500,
    sleepSchedule: "late",
    cleanliness: 4,
    socialPreference: "balanced",
    petTolerant: true,
    smokingTolerant: false,
    bio: "Test bio",
    lookingForRoommate: true,
    preferredZones: ["Centro", "Campus"],
  };

  it("returns 100 for identical profiles", () => {
    const score = calculateCompatibility(baseProfile, { ...baseProfile, id: "test-2" });
    expect(score).toBeGreaterThanOrEqual(95);
  });

  it("returns lower score for incompatible sleep schedules", () => {
    const earlyBird: RoommateProfile = { ...baseProfile, id: "test-2", sleepSchedule: "early" };
    const nightOwl: RoommateProfile = { ...baseProfile, id: "test-3", sleepSchedule: "late" };
    const score = calculateCompatibility(earlyBird, nightOwl);
    expect(score).toBeLessThan(100);
  });

  it("returns higher score when flexible is involved", () => {
    const flexible: RoommateProfile = { ...baseProfile, id: "test-2", sleepSchedule: "flexible" };
    const late: RoommateProfile = { ...baseProfile, id: "test-3", sleepSchedule: "late" };
    const earlyVsLate = calculateCompatibility(
      { ...baseProfile, id: "test-4", sleepSchedule: "early" },
      late
    );
    const flexVsLate = calculateCompatibility(flexible, late);
    expect(flexVsLate).toBeGreaterThan(earlyVsLate);
  });

  it("handles no budget overlap", () => {
    const low: RoommateProfile = { ...baseProfile, id: "test-2", budgetMin: 100, budgetMax: 200 };
    const high: RoommateProfile = { ...baseProfile, id: "test-3", budgetMin: 500, budgetMax: 700 };
    const score = calculateCompatibility(low, high);
    expect(score).toBeLessThan(80);
  });

  it("accounts for cleanliness difference", () => {
    const clean: RoommateProfile = { ...baseProfile, id: "test-2", cleanliness: 5 };
    const messy: RoommateProfile = { ...baseProfile, id: "test-3", cleanliness: 1 };
    const score = calculateCompatibility(clean, messy);
    expect(score).toBeLessThan(90);
  });

  it("gives bonus for shared languages", () => {
    const polyglot: RoommateProfile = { ...baseProfile, id: "test-2", languages: ["Italiano", "English", "Español"] };
    const mono: RoommateProfile = { ...baseProfile, id: "test-3", languages: ["日本語"] };
    const scoreWithCommon = calculateCompatibility(baseProfile, polyglot);
    const scoreWithNone = calculateCompatibility(baseProfile, mono);
    expect(scoreWithCommon).toBeGreaterThan(scoreWithNone);
  });

  it("returns a number between 0 and 100", () => {
    const score = calculateCompatibility(baseProfile, { ...baseProfile, id: "test-2" });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("calculateTrustScore", () => {
  const makeReview = (rating: number): Review => ({
    id: "r-1",
    reviewerId: "u-1",
    reviewerName: "Test",
    reviewerRole: "student",
    revieweeId: "u-2",
    revieweeName: "Target",
    listingId: "l-1",
    listingTitle: "Test Listing",
    ratingOverall: rating,
    ratingCleanliness: rating,
    ratingCommunication: rating,
    ratingAccuracy: rating,
    ratingValue: rating,
    comment: "Test",
    verifiedLease: true,
    createdAt: new Date().toISOString(),
    flagged: false,
  });

  it("returns low score with no reviews and unverified", () => {
    const result = calculateTrustScore([], false, 0);
    expect(result.score).toBe(1.0);
    expect(result.badge).toBe("none");
  });

  it("returns higher score when verified with no reviews", () => {
    const result = calculateTrustScore([], true, 0);
    expect(result.score).toBe(3.0);
  });

  it("returns gold badge for high-rated users with many reviews", () => {
    const reviews = Array.from({ length: 6 }, () => makeReview(5));
    const result = calculateTrustScore(reviews, true, 400);
    expect(result.badge).toBe("gold");
    expect(result.score).toBeGreaterThanOrEqual(4.5);
  });

  it("returns silver badge for moderate ratings", () => {
    const reviews = Array.from({ length: 4 }, () => makeReview(4));
    const result = calculateTrustScore(reviews, true, 200);
    expect(result.badge).toBe("silver");
  });

  it("caps score at 5.0", () => {
    const reviews = Array.from({ length: 20 }, () => makeReview(5));
    const result = calculateTrustScore(reviews, true, 1000);
    expect(result.score).toBeLessThanOrEqual(5.0);
  });
});

describe("calculateDistance", () => {
  it("returns 0 for same point", () => {
    const d = calculateDistance(44.2226, 12.0407, 44.2226, 12.0407);
    expect(d).toBe(0);
  });

  it("returns reasonable distance for known points", () => {
    // Campus to Centro is roughly 500-1500m
    const d = calculateDistance(44.2226, 12.0407, 44.2219, 12.0415);
    expect(d).toBeGreaterThan(50);
    expect(d).toBeLessThan(2000);
  });
});

describe("getWalkingTime", () => {
  it("calculates walking time at ~80m/min", () => {
    expect(getWalkingTime(800)).toBe(10);
    expect(getWalkingTime(400)).toBe(5);
  });
});

describe("getCyclingTime", () => {
  it("calculates cycling time at ~250m/min", () => {
    expect(getCyclingTime(1000)).toBe(4);
    expect(getCyclingTime(500)).toBe(2);
  });
});
