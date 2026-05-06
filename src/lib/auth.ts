/**
 * Authentication module — user management, session handling, and access control.
 *
 * Provides cookie-based session authentication with bcrypt password hashing.
 * Sessions expire after 7 days and include CSRF tokens for mutation protection.
 *
 * @remarks
 * - New user registrations use bcrypt (cost 12) via {@link hashPasswordSecure}.
 * - Seed data uses a legacy hash for backward compatibility.
 * - Role hierarchy: `student` < `landlord` < `admin`.
 * - `admin` role has implicit access to all `landlord` and `student` routes.
 *
 * @module auth
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InMemoryStore } from "@/lib/db";
import { hashPasswordSecure, verifyPasswordSecure, generateCsrfToken } from "@/lib/password";

/** User role for role-based access control. */
export type UserRole = "student" | "landlord" | "admin";

/** Authenticated user record stored in the user store. */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  verified: boolean;
  universityId?: string;
  universityDocument?: string;
  createdAt: string;
  profileComplete: boolean;
  onboardingComplete?: boolean;
  campusId?: string;
  banned?: boolean;
  banReason?: string;
}

/** Server-side session record, linked to a user and stored in sessionStore. */
export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  csrfToken?: string;
}

export const userStore = new InMemoryStore<User>();
export const sessionStore = new InMemoryStore<Session>();

// Legacy hash for seed data backward compatibility
function legacyHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${hash.toString(36)}`;
}

// Seed demo users (using legacy hash for demo, new registrations use bcrypt)
userStore.seed([
  {
    id: "user-student-1",
    email: "martina.lopez@studio.unibo.it",
    name: "Martina López",
    role: "student",
    passwordHash: legacyHash("password123"),
    verified: true,
    universityId: "0001234567",
    createdAt: new Date().toISOString(),
    profileComplete: true,
    onboardingComplete: true,
    campusId: "campus-forli",
  },
  {
    id: "user-student-2",
    email: "luca.bianchi@studio.unibo.it",
    name: "Luca Bianchi",
    role: "student",
    passwordHash: legacyHash("password123"),
    verified: true,
    universityId: "0001234568",
    createdAt: new Date().toISOString(),
    profileComplete: true,
    onboardingComplete: true,
    campusId: "campus-forli",
  },
  {
    id: "user-student-3",
    email: "anna.petrova@studio.unibo.it",
    name: "Anna Petrova",
    role: "student",
    passwordHash: legacyHash("password123"),
    verified: true,
    universityId: "0001234569",
    createdAt: new Date().toISOString(),
    profileComplete: true,
    onboardingComplete: false,
    campusId: "campus-forli",
  },
  {
    id: "user-student-4",
    email: "kenji.tanaka@studio.unibo.it",
    name: "Kenji Tanaka",
    role: "student",
    passwordHash: legacyHash("password123"),
    verified: false,
    createdAt: new Date().toISOString(),
    profileComplete: false,
    onboardingComplete: false,
    campusId: "campus-forli",
  },
  {
    id: "user-landlord-1",
    email: "elena.rossi@casastudente.it",
    name: "Elena Rossi",
    role: "landlord",
    passwordHash: legacyHash("password123"),
    verified: true,
    createdAt: new Date().toISOString(),
    profileComplete: true,
    onboardingComplete: true,
  },
  {
    id: "user-landlord-2",
    email: "marco.guidi@casastudente.it",
    name: "Marco Guidi",
    role: "landlord",
    passwordHash: legacyHash("password123"),
    verified: true,
    createdAt: new Date().toISOString(),
    profileComplete: true,
    onboardingComplete: true,
  },
  {
    id: "user-admin-1",
    email: "admin@casastudente.it",
    name: "Admin CasaStudente",
    role: "admin",
    passwordHash: legacyHash("admin123"),
    verified: true,
    createdAt: new Date().toISOString(),
    profileComplete: true,
    onboardingComplete: true,
  },
]);

/** @deprecated Use hashPasswordSecure for new registrations */
export function hashPassword(password: string): Promise<string> {
  return hashPasswordSecure(password);
}

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Create a new user account with bcrypt-hashed password.
 *
 * @param email - User's email address (must be unique).
 * @param name - Display name.
 * @param password - Plain-text password (will be hashed with bcrypt cost 12).
 * @param role - User role (`student` or `landlord`).
 * @returns The created {@link User}, or `{ error: string }` if email is taken.
 */
export async function createUser(
  email: string,
  name: string,
  password: string,
  role: UserRole
): Promise<User | { error: string }> {
  const existing = await userStore.filter((u) => u.email === email);
  if (existing.length > 0) {
    return { error: "Email già registrata" };
  }

  const user: User = {
    id: `user-${generateId()}`,
    email,
    name,
    role,
    passwordHash: await hashPasswordSecure(password),
    verified: false,
    createdAt: new Date().toISOString(),
    profileComplete: false,
    onboardingComplete: false,
  };

  await userStore.create(user);
  return user;
}

/**
 * Authenticate a user by email and password.
 *
 * Supports bcrypt, legacy PBKDF2, and legacy demo hash formats.
 * Returns `null` if credentials are invalid or the user is banned.
 *
 * @param email - The user's email address.
 * @param password - The plain-text password to verify.
 * @returns The authenticated {@link User}, or `null` on failure.
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = await userStore.filter((u) => u.email === email);
  if (users.length === 0) return null;

  const user = users[0];
  if (user.banned) return null;

  if (!(await verifyPasswordSecure(password, user.passwordHash))) return null;

  return user;
}

/**
 * Create a new session for a user with a 7-day expiry and CSRF token.
 *
 * @param userId - The authenticated user's ID.
 * @returns An object with the `sessionId` and `csrfToken` to set as cookies.
 */
export async function createSession(userId: string): Promise<{ sessionId: string; csrfToken: string }> {
  const csrfToken = generateCsrfToken();
  const session: Session = {
    id: `session-${generateId()}`,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    csrfToken,
  };

  await sessionStore.create(session);
  return { sessionId: session.id, csrfToken };
}

/**
 * Get the currently authenticated user from the session cookie.
 *
 * Reads the `session_id` cookie, validates the session hasn't expired,
 * and returns the associated user. Returns `null` if no valid session exists.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (!sessionId) return null;

  const session = await sessionStore.findById(sessionId);
  if (!session) return null;

  if (new Date(session.expiresAt) < new Date()) {
    await sessionStore.delete(sessionId);
    return null;
  }

  const user = await userStore.findById(session.userId);
  return user ?? null;
}

/**
 * Require authentication — redirects to login if no valid session.
 * Use in server components and server actions that need a logged-in user.
 *
 * @throws Redirects to `/auth/login` (never returns `null`).
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

/**
 * Require a specific role (or admin). Redirects to login if unauthorized.
 *
 * @param role - The required role (`student` or `landlord`). Admins always pass.
 * @throws Redirects to `/auth/login` if user lacks the required role.
 */
export async function requireRole(role: UserRole): Promise<User> {
  const user = await requireAuth();
  if (user.role !== role && user.role !== "admin") {
    redirect("/auth/login");
  }
  return user;
}

/**
 * Require admin role. Redirects to home if current user is not an admin.
 *
 * @throws Redirects to `/` for non-admin users.
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "admin") {
    redirect("/");
  }
  return user;
}

/** Destroy the current session and clear auth cookies. */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (sessionId) {
    await sessionStore.delete(sessionId);
    cookieStore.delete("session_id");
    cookieStore.delete("csrf_token");
  }
}
