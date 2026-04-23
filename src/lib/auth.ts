import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InMemoryStore } from "@/lib/db";
import { hashPasswordSecure, verifyPasswordSecure } from "@/lib/password";

export type UserRole = "student" | "landlord" | "admin";

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

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
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

// Seed demo users (using legacy hash for demo, new registrations use PBKDF2)
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
export function hashPassword(password: string): string {
  return hashPasswordSecure(password);
}

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

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
    passwordHash: hashPasswordSecure(password),
    verified: false,
    createdAt: new Date().toISOString(),
    profileComplete: false,
    onboardingComplete: false,
  };

  await userStore.create(user);
  return user;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = await userStore.filter((u) => u.email === email);
  if (users.length === 0) return null;

  const user = users[0];
  if (user.banned) return null;

  if (!verifyPasswordSecure(password, user.passwordHash)) return null;

  return user;
}

export async function createSession(userId: string): Promise<string> {
  const session: Session = {
    id: `session-${generateId()}`,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  await sessionStore.create(session);
  return session.id;
}

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

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

export async function requireRole(role: UserRole): Promise<User> {
  const user = await requireAuth();
  if (user.role !== role && user.role !== "admin") {
    redirect("/auth/login");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "admin") {
    redirect("/");
  }
  return user;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (sessionId) {
    await sessionStore.delete(sessionId);
    cookieStore.delete("session_id");
  }
}
