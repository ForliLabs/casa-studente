import { describe, it, expect } from "vitest";
import {
  createListingSchema,
  createPaymentSchema,
  createReviewSchema,
  sendMessageSchema,
  contactFormSchema,
  aiGenerateSchema,
  nlSearchSchema,
  savedSearchSchema,
  createLeaseSchema,
} from "@/lib/validation";

describe("Validation Schemas — Listings", () => {
  it("validates a valid listing", () => {
    const result = createListingSchema.safeParse({
      title: "Beautiful room near campus",
      address: "Via Roma 123, Forlì",
      type: "stanza singola",
      price: 350,
    });
    expect(result.success).toBe(true);
  });

  it("rejects short title", () => {
    const result = createListingSchema.safeParse({
      title: "Hi",
      address: "Via Roma 123",
      type: "stanza singola",
      price: 350,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = createListingSchema.safeParse({
      title: "Valid title here",
      address: "Via Roma 123",
      type: "stanza singola",
      price: -100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid listing type", () => {
    const result = createListingSchema.safeParse({
      title: "Valid title here",
      address: "Via Roma 123",
      type: "villa con piscina",
      price: 350,
    });
    expect(result.success).toBe(false);
  });

  it("strips HTML from description", () => {
    const result = createListingSchema.safeParse({
      title: "Test listing",
      address: "Via Roma 123",
      type: "monolocale",
      price: 500,
      description: '<script>alert("xss")</script>Nice apartment',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).not.toContain("<script>");
      expect(result.data.description).toContain("Nice apartment");
    }
  });

  it("coerces string price to number", () => {
    const result = createListingSchema.safeParse({
      title: "Test listing",
      address: "Via Roma 123",
      type: "bilocale",
      price: "450",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(450);
      expect(typeof result.data.price).toBe("number");
    }
  });
});

describe("Validation Schemas — Payments", () => {
  it("validates a valid payment", () => {
    const result = createPaymentSchema.safeParse({
      recipientId: "user-landlord-1",
      recipientName: "Elena Rossi",
      listingId: "listing-1",
      listingTitle: "Via Roma 123",
      amount: 360,
      type: "rent",
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero amount", () => {
    const result = createPaymentSchema.safeParse({
      recipientId: "user-1",
      recipientName: "Test",
      listingId: "l-1",
      listingTitle: "Test",
      amount: 0,
      type: "rent",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid payment type", () => {
    const result = createPaymentSchema.safeParse({
      recipientId: "user-1",
      recipientName: "Test",
      listingId: "l-1",
      listingTitle: "Test",
      amount: 100,
      type: "bitcoin",
    });
    expect(result.success).toBe(false);
  });
});

describe("Validation Schemas — Reviews", () => {
  it("validates a valid review", () => {
    const result = createReviewSchema.safeParse({
      revieweeId: "user-1",
      revieweeName: "Test User",
      listingId: "l-1",
      listingTitle: "Test Listing",
      ratingOverall: 5,
      ratingCleanliness: 4,
      ratingCommunication: 5,
      ratingAccuracy: 4,
      ratingValue: 3,
      comment: "This is a detailed review with enough content.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating out of range", () => {
    const result = createReviewSchema.safeParse({
      revieweeId: "user-1",
      revieweeName: "Test",
      listingId: "l-1",
      listingTitle: "Test",
      ratingOverall: 6, // > 5
      ratingCleanliness: 4,
      ratingCommunication: 5,
      ratingAccuracy: 4,
      ratingValue: 3,
      comment: "Valid comment here enough text",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short comments", () => {
    const result = createReviewSchema.safeParse({
      revieweeId: "user-1",
      revieweeName: "Test",
      listingId: "l-1",
      listingTitle: "Test",
      ratingOverall: 5,
      ratingCleanliness: 4,
      ratingCommunication: 5,
      ratingAccuracy: 4,
      ratingValue: 3,
      comment: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("defaults omitted sub-ratings to ratingOverall", () => {
    const result = createReviewSchema.safeParse({
      revieweeId: "user-1",
      revieweeName: "Test User",
      listingId: "l-1",
      listingTitle: "Test Listing",
      ratingOverall: 4,
      ratingCleanliness: 0,
      ratingCommunication: 0,
      ratingAccuracy: 0,
      ratingValue: 0,
      comment: "This is a detailed review with enough content.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ratingCleanliness).toBe(4);
      expect(result.data.ratingCommunication).toBe(4);
      expect(result.data.ratingAccuracy).toBe(4);
      expect(result.data.ratingValue).toBe(4);
    }
  });

  it("keeps sub-ratings when explicitly provided", () => {
    const result = createReviewSchema.safeParse({
      revieweeId: "user-1",
      revieweeName: "Test User",
      listingId: "l-1",
      listingTitle: "Test Listing",
      ratingOverall: 5,
      ratingCleanliness: 3,
      ratingCommunication: 2,
      ratingAccuracy: 4,
      ratingValue: 1,
      comment: "This is a detailed review with enough content.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ratingCleanliness).toBe(3);
      expect(result.data.ratingCommunication).toBe(2);
      expect(result.data.ratingAccuracy).toBe(4);
      expect(result.data.ratingValue).toBe(1);
    }
  });
});

describe("Validation Schemas — Messages", () => {
  it("validates a valid message", () => {
    const result = sendMessageSchema.safeParse({
      conversationId: "conv-1",
      content: "Hello, I'm interested in the listing!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty message", () => {
    const result = sendMessageSchema.safeParse({
      conversationId: "conv-1",
      content: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects suspicious message payloads", () => {
    const result = sendMessageSchema.safeParse({
      conversationId: "conv-1",
      content: '<img src=x onerror="alert(1)"> hello',
    });
    expect(result.success).toBe(false);
  });
});

describe("Validation Schemas — Contact Form", () => {
  it("validates a valid contact form", () => {
    const result = contactFormSchema.safeParse({
      listingId: "listing-1",
      name: "Martina López",
      email: "martina@example.com",
      message: "I'd like to schedule a visit for this apartment.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = contactFormSchema.safeParse({
      listingId: "l-1",
      name: "Test",
      email: "not-an-email",
      message: "Valid message with enough content here.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects suspicious contact messages", () => {
    const result = contactFormSchema.safeParse({
      listingId: "l-1",
      name: "Test",
      email: "user@example.com",
      phone: "+39 333 1234567",
      message: '<script>alert(1)</script> visit request',
    });
    expect(result.success).toBe(false);
  });
});

describe("Validation Schemas — AI", () => {
  it("validates AI generation input", () => {
    const result = aiGenerateSchema.safeParse({
      type: "monolocale",
      zone: "Centro",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty type", () => {
    const result = aiGenerateSchema.safeParse({
      type: "",
      zone: "Centro",
    });
    expect(result.success).toBe(false);
  });

  it("validates NL search with minimum length", () => {
    expect(nlSearchSchema.safeParse({ query: "ab" }).success).toBe(false);
    expect(nlSearchSchema.safeParse({ query: "monolocale centro" }).success).toBe(true);
  });

  it("rejects suspicious NL search queries", () => {
    expect(nlSearchSchema.safeParse({ query: '<script>alert(1)</script> centro' }).success).toBe(false);
  });
});

describe("Validation Schemas — Saved Search", () => {
  it("validates a saved search", () => {
    const result = savedSearchSchema.safeParse({
      name: "My search",
      zone: "Centro",
      maxPrice: 500,
      notifyEmail: true,
    });
    expect(result.success).toBe(true);
  });

  it("strips HTML from name", () => {
    const result = savedSearchSchema.safeParse({
      name: '<img src=x onerror="alert(1)">My search',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).not.toContain("<img");
    }
  });
});

describe("Validation Schemas — Lease", () => {
  it("validates a lease creation", () => {
    const result = createLeaseSchema.safeParse({
      listingId: "l-1",
      listingTitle: "Via Roma 123",
      address: "Via Roma 123, Forlì",
      monthlyRent: 360,
      startDate: "2026-09-01",
      endDate: "2027-08-31",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = createLeaseSchema.safeParse({
      listingId: "l-1",
      listingTitle: "Test",
      address: "Test",
      monthlyRent: 360,
      // missing startDate, endDate
    });
    expect(result.success).toBe(false);
  });
});
