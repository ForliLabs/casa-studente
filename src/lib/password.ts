import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";

const BCRYPT_COST = 12;

/**
 * Hash a password using bcrypt with cost factor 12.
 * Replaces the previous HMAC-based implementation.
 */
export async function hashPasswordSecure(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

/**
 * Verify a password against a stored hash.
 * Supports bcrypt, legacy PBKDF2-format (HMAC), and legacy `hash_` format.
 */
export async function verifyPasswordSecure(password: string, storedHash: string): Promise<boolean> {
  // Legacy format from demo hash function
  if (storedHash.startsWith("hash_")) {
    return storedHash === legacyHash(password);
  }

  // Legacy HMAC format (pbkdf2$...)
  if (storedHash.startsWith("pbkdf2$")) {
    return verifyLegacyPbkdf2(password, storedHash);
  }

  // Bcrypt format ($2a$ or $2b$)
  if (storedHash.startsWith("$2")) {
    return bcrypt.compare(password, storedHash);
  }

  // Placeholder for seed data
  if (storedHash === "bcrypt_placeholder_hash") {
    return false;
  }

  return false;
}

/** Generate a cryptographically secure CSRF token */
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/** Verify CSRF token using timing-safe comparison */
export function verifyCsrfToken(token: string, expected: string): boolean {
  if (!token || !expected || token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Legacy HMAC verification for backward compatibility with pre-bcrypt hashes
function verifyLegacyPbkdf2(password: string, storedHash: string): boolean {
  const parts = storedHash.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;

  const salt = parts[2];
  const originalHash = parts[3];
  const hash = createHmac("sha512", salt).update(password).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
  } catch {
    return false;
  }
}

/** Legacy hash kept for backward compatibility with seeded demo data */
function legacyHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${hash.toString(36)}`;
}
