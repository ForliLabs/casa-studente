import { describe, it, expect } from "vitest";
import {
  parseUtilitiesCost,
  estimateTransportCost,
  calculateMonthlyCost,
  mergeRoommatePreferences,
} from "@/lib/stores";

describe("parseUtilitiesCost", () => {
  it("detects fully included utilities", () => {
    const result = parseUtilitiesCost("Tutto incluso");
    expect(result.included).toBe(true);
    expect(result.estimate).toBe(0);
  });

  it("detects partially included utilities with cap", () => {
    const result = parseUtilitiesCost("Utenze incluse fino a €60/mese");
    expect(result.included).toBe(true);
    expect(result.estimate).toBe(0);
    expect(result.note).toContain("60");
  });

  it("detects excluded utilities with estimate", () => {
    const result = parseUtilitiesCost("Utenze escluse, stima €90/mese");
    expect(result.included).toBe(false);
    expect(result.estimate).toBe(90);
  });

  it("handles partially included (condominium)", () => {
    const result = parseUtilitiesCost("Condominio e acqua inclusi");
    expect(result.included).toBe(false);
    expect(result.estimate).toBe(30);
  });

  it("handles consumption-based utilities", () => {
    const result = parseUtilitiesCost("Wi‑Fi incluso, utenze a consumo");
    expect(result.included).toBe(false);
    expect(result.estimate).toBe(70);
  });

  it("handles unknown utilities text", () => {
    const result = parseUtilitiesCost("Da concordare");
    expect(result.included).toBe(false);
    expect(result.estimate).toBe(60);
  });

  it("handles riscaldamento incluso", () => {
    const result = parseUtilitiesCost("Riscaldamento incluso nelle spese");
    expect(result.included).toBe(false);
    expect(result.estimate).toBe(30);
  });
});

describe("estimateTransportCost", () => {
  it("returns 0 for Campus zone", () => {
    const result = estimateTransportCost("Campus");
    expect(result.estimate).toBe(0);
  });

  it("returns low cost for Centro", () => {
    const result = estimateTransportCost("Centro");
    expect(result.estimate).toBe(10);
  });

  it("returns bus cost for Stazione", () => {
    const result = estimateTransportCost("Stazione");
    expect(result.estimate).toBe(25);
  });

  it("returns default for unknown zone", () => {
    const result = estimateTransportCost("Unknown");
    expect(result.estimate).toBe(25);
  });
});

describe("calculateMonthlyCost", () => {
  it("calculates total for fully included utilities near campus", () => {
    const result = calculateMonthlyCost(360, "Tutto incluso", "Campus");
    expect(result.rent).toBe(360);
    expect(result.utilitiesEstimate).toBe(0);
    expect(result.utilitiesIncluded).toBe(true);
    expect(result.transportEstimate).toBe(0);
    expect(result.totalEstimate).toBe(360);
  });

  it("calculates total with excluded utilities in Centro", () => {
    const result = calculateMonthlyCost(620, "Utenze escluse, stima €90/mese", "Centro");
    expect(result.rent).toBe(620);
    expect(result.utilitiesEstimate).toBe(90);
    expect(result.transportEstimate).toBe(10);
    expect(result.totalEstimate).toBe(720);
  });

  it("calculates total for station area with condo fees", () => {
    const result = calculateMonthlyCost(750, "Spese condominiali incluse", "Stazione");
    expect(result.rent).toBe(750);
    expect(result.utilitiesIncluded).toBe(false);
    expect(result.transportEstimate).toBe(25);
    expect(result.totalEstimate).toBe(750 + 30 + 25);
  });
});

describe("mergeRoommatePreferences", () => {
  it("returns defaults for empty profiles", () => {
    const result = mergeRoommatePreferences([]);
    expect(result.budgetMin).toBe(0);
    expect(result.budgetMax).toBe(10000);
    expect(result.zones).toEqual([]);
  });

  it("sums budgets for two roommates", () => {
    const result = mergeRoommatePreferences([
      { budgetMin: 250, budgetMax: 400, preferredZones: ["Campus"], petTolerant: false, smokingTolerant: false },
      { budgetMin: 300, budgetMax: 500, preferredZones: ["Campus", "Centro"], petTolerant: false, smokingTolerant: false },
    ]);
    expect(result.budgetMin).toBe(550);
    expect(result.budgetMax).toBe(900);
  });

  it("finds zone intersection when available", () => {
    const result = mergeRoommatePreferences([
      { budgetMin: 200, budgetMax: 400, preferredZones: ["Campus", "Centro"], petTolerant: false, smokingTolerant: false },
      { budgetMin: 300, budgetMax: 500, preferredZones: ["Campus", "Stazione"], petTolerant: false, smokingTolerant: false },
    ]);
    expect(result.zones).toEqual(["Campus"]);
  });

  it("uses zone union when no intersection", () => {
    const result = mergeRoommatePreferences([
      { budgetMin: 200, budgetMax: 400, preferredZones: ["Campus"], petTolerant: false, smokingTolerant: false },
      { budgetMin: 300, budgetMax: 500, preferredZones: ["Stazione"], petTolerant: false, smokingTolerant: false },
    ]);
    expect(result.zones).toContain("Campus");
    expect(result.zones).toContain("Stazione");
  });

  it("sets pet-friendly only if all roommates tolerate pets", () => {
    const result = mergeRoommatePreferences([
      { budgetMin: 200, budgetMax: 400, preferredZones: [], petTolerant: true, smokingTolerant: false },
      { budgetMin: 300, budgetMax: 500, preferredZones: [], petTolerant: false, smokingTolerant: false },
    ]);
    expect(result.requirePetFriendly).toBe(false);
  });

  it("sets pet-friendly when all roommates tolerate pets", () => {
    const result = mergeRoommatePreferences([
      { budgetMin: 200, budgetMax: 400, preferredZones: [], petTolerant: true, smokingTolerant: false },
      { budgetMin: 300, budgetMax: 500, preferredZones: [], petTolerant: true, smokingTolerant: false },
    ]);
    expect(result.requirePetFriendly).toBe(true);
  });

  it("sets no-smoking if any roommate doesn't tolerate smoking", () => {
    const result = mergeRoommatePreferences([
      { budgetMin: 200, budgetMax: 400, preferredZones: [], petTolerant: false, smokingTolerant: true },
      { budgetMin: 300, budgetMax: 500, preferredZones: [], petTolerant: false, smokingTolerant: false },
    ]);
    expect(result.requireNoSmoking).toBe(true);
  });

  it("handles three roommates correctly", () => {
    const result = mergeRoommatePreferences([
      { budgetMin: 200, budgetMax: 350, preferredZones: ["Campus", "Centro"], petTolerant: false, smokingTolerant: false },
      { budgetMin: 250, budgetMax: 400, preferredZones: ["Campus", "Stazione"], petTolerant: false, smokingTolerant: false },
      { budgetMin: 300, budgetMax: 450, preferredZones: ["Campus", "Cava"], petTolerant: false, smokingTolerant: false },
    ]);
    expect(result.budgetMin).toBe(750);
    expect(result.budgetMax).toBe(1200);
    expect(result.zones).toEqual(["Campus"]);
  });
});
