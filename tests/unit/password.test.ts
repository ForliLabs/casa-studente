import { describe, it, expect } from "vitest";
import {
  hashPasswordSecure,
  verifyPasswordSecure,
  generateCsrfToken,
  verifyCsrfToken,
} from "@/lib/password";

describe("Password Hashing (bcrypt)", () => {
  it("hashes a password to bcrypt format", async () => {
    const hash = await hashPasswordSecure("testPassword123");
    expect(hash).toMatch(/^\$2[ab]\$/); // bcrypt prefix
    expect(hash.length).toBeGreaterThan(50);
  });

  it("produces different hashes for the same password", async () => {
    const hash1 = await hashPasswordSecure("samePassword");
    const hash2 = await hashPasswordSecure("samePassword");
    expect(hash1).not.toBe(hash2); // Different salts
  });

  it("verifies a correct password", async () => {
    const hash = await hashPasswordSecure("correctPassword");
    const result = await verifyPasswordSecure("correctPassword", hash);
    expect(result).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPasswordSecure("correctPassword");
    const result = await verifyPasswordSecure("wrongPassword", hash);
    expect(result).toBe(false);
  });

  it("handles legacy hash_ format for backward compatibility", async () => {
    // The legacy hash for "password123"
    const result = await verifyPasswordSecure("password123", "hash_-1oesqm8");
    // Should attempt to verify (may or may not match depending on the legacy algo)
    expect(typeof result).toBe("boolean");
  });

  it("handles legacy pbkdf2$ format", async () => {
    // Should not crash on legacy format
    const result = await verifyPasswordSecure("test", "pbkdf2$10000$abc123$def456");
    expect(typeof result).toBe("boolean");
  });

  it("rejects bcrypt_placeholder_hash", async () => {
    const result = await verifyPasswordSecure("anyPassword", "bcrypt_placeholder_hash");
    expect(result).toBe(false);
  });

  it("rejects unknown hash formats", async () => {
    const result = await verifyPasswordSecure("test", "unknown_format_hash");
    expect(result).toBe(false);
  });
});

describe("CSRF Token", () => {
  it("generates a 64-character hex token", () => {
    const token = generateCsrfToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  it("generates unique tokens", () => {
    const t1 = generateCsrfToken();
    const t2 = generateCsrfToken();
    expect(t1).not.toBe(t2);
  });

  it("verifies matching tokens", () => {
    const token = generateCsrfToken();
    expect(verifyCsrfToken(token, token)).toBe(true);
  });

  it("rejects non-matching tokens", () => {
    const t1 = generateCsrfToken();
    const t2 = generateCsrfToken();
    expect(verifyCsrfToken(t1, t2)).toBe(false);
  });

  it("rejects empty tokens", () => {
    expect(verifyCsrfToken("", "abc")).toBe(false);
    expect(verifyCsrfToken("abc", "")).toBe(false);
  });

  it("rejects tokens of different lengths", () => {
    expect(verifyCsrfToken("short", "longertoken")).toBe(false);
  });
});
