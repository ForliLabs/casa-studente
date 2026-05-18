import { describe, it, expect } from "vitest";
import { roommateProfileSchema } from "@/lib/validation";

describe("roommateProfileSchema", () => {
  const validInput = {
    studyProgram: "Ingegneria Aerospaziale",
    languages: "Italiano, English",
    budgetMin: 250,
    budgetMax: 500,
    sleepSchedule: "flexible",
    cleanliness: 4,
    socialPreference: "balanced",
    petTolerant: "true",
    smokingTolerant: "false",
    bio: "Studente magistrale, cerco un coinquilino tranquillo.",
    preferredZones: "Centro, Campus",
  };

  it("validates a complete valid profile", () => {
    const result = roommateProfileSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects short study program", () => {
    const result = roommateProfileSchema.safeParse({ ...validInput, studyProgram: "X" });
    expect(result.success).toBe(false);
  });

  it("rejects short bio", () => {
    const result = roommateProfileSchema.safeParse({ ...validInput, bio: "Ciao" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid sleep schedule", () => {
    const result = roommateProfileSchema.safeParse({ ...validInput, sleepSchedule: "never" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid social preference", () => {
    const result = roommateProfileSchema.safeParse({ ...validInput, socialPreference: "extreme" });
    expect(result.success).toBe(false);
  });

  it("rejects cleanliness out of range", () => {
    const result = roommateProfileSchema.safeParse({ ...validInput, cleanliness: 0 });
    expect(result.success).toBe(false);
    const result2 = roommateProfileSchema.safeParse({ ...validInput, cleanliness: 6 });
    expect(result2.success).toBe(false);
  });

  it("rejects budgetMax less than budgetMin", () => {
    const result = roommateProfileSchema.safeParse({ ...validInput, budgetMin: 500, budgetMax: 200 });
    expect(result.success).toBe(false);
  });

  it("coerces numeric strings from form data", () => {
    const result = roommateProfileSchema.safeParse({
      ...validInput,
      budgetMin: "250",
      budgetMax: "500",
      cleanliness: "4",
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative budgetMin", () => {
    const result = roommateProfileSchema.safeParse({ ...validInput, budgetMin: -100 });
    expect(result.success).toBe(false);
  });
});
