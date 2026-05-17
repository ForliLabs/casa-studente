import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock cookies() to avoid Next.js server-only errors
vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    })
  ),
}));

// Mock revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Must import after mocks
import { reviewStore } from "@/lib/stores";

// Helper to build review form data
function makeReviewFormData(overrides: Record<string, string> = {}): FormData {
  const defaults: Record<string, string> = {
    revieweeId: "user-landlord-1",
    revieweeName: "Elena Rossi",
    listingId: "via-colombo-21-singola",
    listingTitle: "Stanza singola luminosa vicino al Campus",
    ratingOverall: "5",
    ratingCleanliness: "4",
    ratingCommunication: "5",
    ratingAccuracy: "4",
    ratingValue: "3",
    comment: "Ottima esperienza, proprietaria gentile e disponibile.",
  };
  const fd = new FormData();
  const merged = { ...defaults, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    fd.set(key, value);
  }
  return fd;
}

describe("submitReviewAction", () => {
  beforeEach(async () => {
    vi.resetModules();

    // Clean up any reviews created during tests (keep only seed data)
    const allReviews = await reviewStore.findAll();
    for (const r of allReviews) {
      if (!r.id.startsWith("review-") || r.id.match(/^review-\d+$/)) continue;
      // Delete non-seed reviews
      if (!["review-1", "review-2", "review-3"].includes(r.id)) {
        await reviewStore.delete(r.id);
      }
    }
  });

  it("rejects unauthenticated users", async () => {
    const { cookies } = await import("next/headers");
    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi.fn(() => undefined),
      set: vi.fn(),
      delete: vi.fn(),
    } as never);

    const { submitReviewAction } = await import("@/lib/actions/reviews");
    const result = await submitReviewAction(makeReviewFormData());
    expect(result).toHaveProperty("error");
    expect(result.error).toContain("accedere");
  });

  it("prevents self-reviews", async () => {
    // Simulate landlord-1 logged in trying to review themselves
    const { cookies } = await import("next/headers");
    const { sessionStore } = await import("@/lib/auth");

    // Create a session for landlord-1
    const sessionId = "test-session-self-review";
    await sessionStore.create({
      id: sessionId,
      userId: "user-landlord-1",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi.fn((name: string) =>
        name === "session_id" ? { value: sessionId } : undefined
      ),
      set: vi.fn(),
      delete: vi.fn(),
    } as never);

    const { submitReviewAction } = await import("@/lib/actions/reviews");
    const result = await submitReviewAction(
      makeReviewFormData({ revieweeId: "user-landlord-1" })
    );
    expect(result).toHaveProperty("error");
    expect(result.error).toContain("te stesso");

    await sessionStore.delete(sessionId);
  });

  it("prevents duplicate reviews for the same listing", async () => {
    const { cookies } = await import("next/headers");
    const { sessionStore } = await import("@/lib/auth");

    const sessionId = "test-session-dup";
    await sessionStore.create({
      id: sessionId,
      userId: "user-student-2",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    const mockCookies = {
      get: vi.fn((name: string) =>
        name === "session_id" ? { value: sessionId } : undefined
      ),
      set: vi.fn(),
      delete: vi.fn(),
    } as never;

    // Student-2 already has a seed review for via-colombo... no, they have one for viale-roma-48
    // Let's use listing "via-colombo-21-singola" which student-2 has NOT reviewed
    vi.mocked(cookies).mockResolvedValueOnce(mockCookies);
    const { submitReviewAction } = await import("@/lib/actions/reviews");

    // First submission should succeed
    const result1 = await submitReviewAction(makeReviewFormData());
    expect(result1).toHaveProperty("success", true);

    // Second submission for the same listing should be rejected
    vi.mocked(cookies).mockResolvedValueOnce(mockCookies);
    const result2 = await submitReviewAction(makeReviewFormData());
    expect(result2).toHaveProperty("error");
    expect(result2.error).toContain("già");

    await sessionStore.delete(sessionId);
  });

  it("rejects reviews for non-existent listings", async () => {
    const { cookies } = await import("next/headers");
    const { sessionStore } = await import("@/lib/auth");

    const sessionId = "test-session-nonexist";
    await sessionStore.create({
      id: sessionId,
      userId: "user-student-1",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi.fn((name: string) =>
        name === "session_id" ? { value: sessionId } : undefined
      ),
      set: vi.fn(),
      delete: vi.fn(),
    } as never);

    const { submitReviewAction } = await import("@/lib/actions/reviews");
    const result = await submitReviewAction(
      makeReviewFormData({ listingId: "nonexistent-listing" })
    );
    expect(result).toHaveProperty("error");
    expect(result.error).toContain("non trovato");

    await sessionStore.delete(sessionId);
  });

  it("rejects mismatched reviewee (forged target)", async () => {
    const { cookies } = await import("next/headers");
    const { sessionStore } = await import("@/lib/auth");

    const sessionId = "test-session-mismatch";
    await sessionStore.create({
      id: sessionId,
      userId: "user-student-1",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi.fn((name: string) =>
        name === "session_id" ? { value: sessionId } : undefined
      ),
      set: vi.fn(),
      delete: vi.fn(),
    } as never);

    const { submitReviewAction } = await import("@/lib/actions/reviews");
    // Try to submit a review where the revieweeId doesn't match the listing's landlord
    const result = await submitReviewAction(
      makeReviewFormData({ revieweeId: "user-landlord-2" })
    );
    expect(result).toHaveProperty("error");
    expect(result.error).toContain("non corrisponde");

    await sessionStore.delete(sessionId);
  });
});
