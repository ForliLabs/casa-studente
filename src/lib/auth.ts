import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InMemoryStore } from "@/lib/db";

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
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
}

export const userStore = new InMemoryStore<User>();
export const sessionStore = new InMemoryStore<Session>();

// Seed demo users
userStore.seed([
  {
    id: "user-student-1",
    email: "martina.lopez@studio.unibo.it",
    name: "Martina López",
    role: "student",
    passwordHash: hashPassword("password123"),
    verified: true,
    universityId: "0001234567",
    createdAt: new Date().toISOString(),
    profileComplete: true,
  },
  {
    id: "user-student-2",
    email: "luca.bianchi@studio.unibo.it",
    name: "Luca Bianchi",
    role: "student",
    passwordHash: hashPassword("password123"),
    verified: true,
    universityId: "0001234568",
    createdAt: new Date().toISOString(),
    profileComplete: true,
  },
  {
    id: "user-landlord-1",
    email: "elena.rossi@casastudente.it",
    name: "Elena Rossi",
    role: "landlord",
    passwordHash: hashPassword("password123"),
    verified: true,
    createdAt: new Date().toISOString(),
    profileComplete: true,
  },
  {
    id: "user-landlord-2",
    email: "marco.guidi@casastudente.it",
    name: "Marco Guidi",
    role: "landlord",
    passwordHash: hashPassword("password123"),
    verified: true,
    createdAt: new Date().toISOString(),
    profileComplete: true,
  },
]);

// Simple hash for demo (not production-safe)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${hash.toString(36)}`;
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
    passwordHash: hashPassword(password),
    verified: false,
    createdAt: new Date().toISOString(),
    profileComplete: false,
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
  if (user.passwordHash !== hashPassword(password)) return null;

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

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (sessionId) {
    await sessionStore.delete(sessionId);
    cookieStore.delete("session_id");
  }
}
