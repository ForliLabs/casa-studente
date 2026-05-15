import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  verifyUniversitySchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  updateProfileSchema,
} from "@/lib/validation";

describe("Auth Validation — Login Schema", () => {
  it("validates a valid login", () => {
    const result = loginSchema.safeParse({
      email: "user@test.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@test.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too-long email", () => {
    const result = loginSchema.safeParse({
      email: "a".repeat(250) + "@test.com",
      password: "pass",
    });
    expect(result.success).toBe(false);
  });
});

describe("Auth Validation — Register Schema", () => {
  it("validates a valid registration", () => {
    const result = registerSchema.safeParse({
      email: "newuser@test.com",
      name: "Test User",
      password: "SecurePass1",
      role: "student",
    });
    expect(result.success).toBe(true);
  });

  it("defaults role to student", () => {
    const result = registerSchema.safeParse({
      email: "newuser@test.com",
      name: "Test User",
      password: "SecurePass1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe("student");
    }
  });

  it("rejects password shorter than 8 chars", () => {
    const result = registerSchema.safeParse({
      email: "user@test.com",
      name: "Test User",
      password: "Short1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = registerSchema.safeParse({
      email: "user@test.com",
      name: "Test User",
      password: "lowercase123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase", () => {
    const result = registerSchema.safeParse({
      email: "user@test.com",
      name: "Test User",
      password: "UPPERCASE123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without numbers", () => {
    const result = registerSchema.safeParse({
      email: "user@test.com",
      name: "Test User",
      password: "NoNumbers!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too-short name", () => {
    const result = registerSchema.safeParse({
      email: "user@test.com",
      name: "A",
      password: "ValidPass1",
    });
    expect(result.success).toBe(false);
  });

  it("strips HTML from name", () => {
    const result = registerSchema.safeParse({
      email: "user@test.com",
      name: '<script>alert("xss")</script>Real Name',
      password: "ValidPass1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).not.toContain("<script>");
      expect(result.data.name).toContain("Real Name");
    }
  });

  it("rejects invalid role", () => {
    const result = registerSchema.safeParse({
      email: "user@test.com",
      name: "Test",
      password: "ValidPass1",
      role: "superadmin",
    });
    expect(result.success).toBe(false);
  });

  it("accepts landlord role", () => {
    const result = registerSchema.safeParse({
      email: "user@test.com",
      name: "Test Landlord",
      password: "ValidPass1",
      role: "landlord",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe("landlord");
    }
  });
});

describe("Auth Validation — University Verification", () => {
  it("validates valid university ID", () => {
    const result = verifyUniversitySchema.safeParse({
      universityId: "0001234567",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty university ID", () => {
    const result = verifyUniversitySchema.safeParse({
      universityId: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects university ID with special chars", () => {
    const result = verifyUniversitySchema.safeParse({
      universityId: "123!@#",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional document name", () => {
    const result = verifyUniversitySchema.safeParse({
      universityId: "ABC123",
      documentName: "certificate.pdf",
    });
    expect(result.success).toBe(true);
  });
});

describe("Auth Validation — Password Reset", () => {
  it("validates password reset request", () => {
    const result = passwordResetRequestSchema.safeParse({
      email: "user@test.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email in reset request", () => {
    const result = passwordResetRequestSchema.safeParse({
      email: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("validates password reset with strong password", () => {
    const result = passwordResetSchema.safeParse({
      token: "abc123",
      password: "NewSecure1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects weak password in reset", () => {
    const result = passwordResetSchema.safeParse({
      token: "abc123",
      password: "weak",
    });
    expect(result.success).toBe(false);
  });
});

describe("Auth Validation — Profile Update", () => {
  it("validates partial profile update", () => {
    const result = updateProfileSchema.safeParse({
      name: "New Name",
    });
    expect(result.success).toBe(true);
  });

  it("validates full profile update", () => {
    const result = updateProfileSchema.safeParse({
      name: "Updated Name",
      email: "new@email.com",
      phone: "+39 123 456 789",
      campusId: "campus-forli",
    });
    expect(result.success).toBe(true);
  });

  it("validates empty update (all optional)", () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});
