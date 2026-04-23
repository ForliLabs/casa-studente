import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const ITERATIONS = 10000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

/**
 * Hash a password using PBKDF2 with a random salt.
 * Format: `pbkdf2$<iterations>$<salt>$<hash>`
 */
export function hashPasswordSecure(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac(DIGEST, salt)
    .update(password)
    .digest("hex");
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

/**
 * Verify a password against a stored hash.
 * Supports both the new PBKDF2 format and the legacy `hash_` format for backward compatibility.
 */
export function verifyPasswordSecure(password: string, storedHash: string): boolean {
  // Legacy format from demo hash function
  if (storedHash.startsWith("hash_")) {
    return storedHash === legacyHash(password);
  }

  // PBKDF2 format
  const parts = storedHash.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;

  const salt = parts[2];
  const originalHash = parts[3];
  const hash = createHmac(DIGEST, salt)
    .update(password)
    .digest("hex");

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
