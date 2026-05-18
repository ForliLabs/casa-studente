import { describe, it, expect } from "vitest";
import type { User } from "@/lib/auth";
import { getDashboardStats, getRecentActivity } from "@/lib/dashboard";

// The dashboard module reads from in-memory stores which are seeded at import.
// We test against the seed data without mocking.

const landlordUser: User = {
  id: "user-landlord-1",
  email: "elena.rossi@casastudente.it",
  name: "Elena Rossi",
  role: "landlord",
  passwordHash: "test",
  verified: true,
  createdAt: new Date().toISOString(),
  profileComplete: true,
};

const studentUser: User = {
  id: "user-student-1",
  email: "martina.lopez@studio.unibo.it",
  name: "Martina López",
  role: "student",
  passwordHash: "test",
  verified: true,
  createdAt: new Date().toISOString(),
  profileComplete: true,
};

describe("getDashboardStats", () => {
  it("returns 4 stat cards for a landlord", async () => {
    const stats = await getDashboardStats(landlordUser);
    expect(stats).toHaveLength(4);
    expect(stats.map((s) => s.label)).toContain("Annunci attivi");
    expect(stats.map((s) => s.label)).toContain("Messaggi");
  });

  it("returns 4 stat cards for a student", async () => {
    const stats = await getDashboardStats(studentUser);
    expect(stats).toHaveLength(4);
    expect(stats.map((s) => s.label)).toContain("Annunci preferiti");
    expect(stats.map((s) => s.label)).toContain("Conversazioni");
  });

  it("returns stats with string values", async () => {
    const stats = await getDashboardStats(landlordUser);
    for (const stat of stats) {
      expect(typeof stat.value).toBe("string");
      expect(typeof stat.label).toBe("string");
    }
  });

  it("landlord stats reflect seed data relationships", async () => {
    const stats = await getDashboardStats(landlordUser);
    const reviewStat = stats.find((s) => s.label === "Recensioni");
    expect(reviewStat).toBeDefined();
    // Elena Rossi has at least 1 review about her in seed data
    expect(reviewStat!.change).toMatch(/\d+ recensioni/);
  });
});

describe("getRecentActivity", () => {
  it("returns activity items for landlord", async () => {
    const activity = await getRecentActivity(landlordUser);
    expect(Array.isArray(activity)).toBe(true);
    expect(activity.length).toBeLessThanOrEqual(5);
  });

  it("returns activity items for student", async () => {
    const activity = await getRecentActivity(studentUser);
    expect(Array.isArray(activity)).toBe(true);
    expect(activity.length).toBeLessThanOrEqual(5);
  });

  it("activity items have required fields", async () => {
    const activity = await getRecentActivity(studentUser);
    for (const item of activity) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("description");
      expect(item).toHaveProperty("time");
    }
  });

  it("returns items sorted by timestamp (newest first)", async () => {
    const activity = await getRecentActivity(landlordUser);
    if (activity.length < 2) return;
    // _sortTimestamp should be in descending order
    for (let i = 1; i < activity.length; i++) {
      const prev = activity[i - 1]._sortTimestamp;
      const curr = activity[i]._sortTimestamp;
      if (prev && curr) {
        expect(new Date(prev).getTime()).toBeGreaterThanOrEqual(
          new Date(curr).getTime()
        );
      }
    }
  });
});
