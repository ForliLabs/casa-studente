import { describe, expect, it } from "vitest";
import {
  computeArrivalReadiness,
  computeGuaranteeSimulation,
  computePodReadiness,
  computeResilienceBand,
  computeTwinOpportunityScore,
  issuePassportToken,
  verifyPassportToken,
} from "@/lib/stores/moonshots";

describe("Moonshot passport", () => {
  it("round-trips a signed passport token", () => {
    const token = issuePassportToken({
      id: "passport-test",
      userId: "user-1",
      holderName: "Test User",
      issuer: "CasaStudente",
      status: "active",
      trustTier: "portable",
      portabilityScore: 88,
      disclosedClaims: [
        { label: "Tenant score", value: "88", shareable: true },
        { label: "Email", value: "hidden", shareable: false },
      ],
      partnerCities: ["Forlì"],
      verificationCount: 0,
      lastIssuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    const payload = verifyPassportToken(token);
    expect(payload?.passportId).toBe("passport-test");
    expect(payload?.disclosedClaims).toEqual(["Tenant score"]);
  });

  it("rejects tampered passport tokens", () => {
    const token = issuePassportToken({
      id: "passport-test-2",
      userId: "user-2",
      holderName: "Another User",
      issuer: "CasaStudente",
      status: "pilot",
      trustTier: "network",
      portabilityScore: 91,
      disclosedClaims: [{ label: "University enrollment", value: "active", shareable: true }],
      partnerCities: ["Bologna"],
      verificationCount: 0,
      lastIssuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    const [encoded] = token.split(".");
    expect(verifyPassportToken(`${encoded}.invalid`)).toBeNull();
  });
});

describe("Moonshot simulators", () => {
  it("computes a guarantee spread and break-even occupancy", () => {
    const simulation = computeGuaranteeSimulation({
      id: "g-1",
      landlordId: "l-1",
      listingId: "listing-1",
      listingTitle: "Listing",
      zone: "Centro",
      marketRent: 500,
      guaranteedRent: 400,
      expectedOccupancy: 0.9,
      demandIndex: 80,
      riskAdjustment: 10,
      downsideBufferMonths: 3,
      targetMargin: 15,
      status: "pilot",
    });

    expect(simulation.expectedMonthlySpread).toBe(50);
    expect(simulation.breakEvenOccupancy).toBe(80);
  });

  it("scores arrival readiness across checkpoint states", () => {
    const readiness = computeArrivalReadiness([
      { id: "1", title: "A", status: "done", owner: "student", daysToGo: 10, automationLevel: "manual" },
      { id: "2", title: "B", status: "in_progress", owner: "platform", daysToGo: 5, automationLevel: "assisted" },
      { id: "3", title: "C", status: "upcoming", owner: "partner", daysToGo: 1, automationLevel: "autonomous" },
    ]);

    expect(readiness).toBeGreaterThan(45);
    expect(readiness).toBeLessThan(70);
  });

  it("ranks urban twin opportunities", () => {
    const score = computeTwinOpportunityScore({
      id: "z-1",
      zone: "Campus",
      affordabilityPressure: 80,
      mobilityReadiness: 60,
      climateSafety: 50,
      occupancyRisk: 70,
      studentMagnetism: 90,
      interventionPriority: "accelerate",
    });

    expect(score).toBeGreaterThan(60);
  });

  it("computes pod readiness from fit and trust", () => {
    const readiness = computePodReadiness({
      id: "pod-1",
      name: "Pod",
      mission: "Mission",
      neighborhood: "Centro",
      targetMembers: 4,
      currentMembers: 3,
      fitScore: 90,
      averageTrustScore: 85,
      occupancyConfidence: 80,
      diversityScore: 70,
      monthlyBudget: 1000,
      waitlist: 2,
      rituals: ["Ritual"],
    });

    expect(readiness).toBeGreaterThan(80);
  });

  it("maps resilience scores into bands", () => {
    expect(computeResilienceBand(90)).toBe("antifragile");
    expect(computeResilienceBand(72)).toBe("adaptive");
    expect(computeResilienceBand(52)).toBe("responsive");
    expect(computeResilienceBand(20)).toBe("fragile");
  });
});
