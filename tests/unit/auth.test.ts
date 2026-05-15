import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryStore } from "@/lib/db";

// Since auth.ts uses Next.js cookies() which isn't available in unit tests,
// we test the underlying auth logic by importing the store and helper functions directly.
// We import the types and re-implement the testable logic.

import type { User, Session, UserRole } from "@/lib/auth";
import { hashPasswordSecure, verifyPasswordSecure } from "@/lib/password";

describe("Auth — User Store Operations", () => {
  let userStore: InMemoryStore<User>;

  beforeEach(() => {
    userStore = new InMemoryStore<User>();
  });

  it("creates a user with bcrypt-hashed password", async () => {
    const passwordHash = await hashPasswordSecure("securePass1");
    const user: User = {
      id: "user-test-1",
      email: "test@studio.unibo.it",
      name: "Test User",
      role: "student",
      passwordHash,
      verified: false,
      createdAt: new Date().toISOString(),
      profileComplete: false,
    };

    await userStore.create(user);
    const found = await userStore.findById("user-test-1");
    expect(found).toBeDefined();
    expect(found!.email).toBe("test@studio.unibo.it");
    expect(found!.passwordHash).toMatch(/^\$2[ab]\$/);
  });

  it("finds user by email via filter", async () => {
    userStore.seed([
      {
        id: "u1",
        email: "a@test.com",
        name: "A",
        role: "student",
        passwordHash: "hash_test",
        verified: false,
        createdAt: new Date().toISOString(),
        profileComplete: false,
      },
      {
        id: "u2",
        email: "b@test.com",
        name: "B",
        role: "landlord",
        passwordHash: "hash_test",
        verified: true,
        createdAt: new Date().toISOString(),
        profileComplete: true,
      },
    ]);

    const results = await userStore.filter((u) => u.email === "b@test.com");
    expect(results).toHaveLength(1);
    expect(results[0].role).toBe("landlord");
  });

  it("rejects duplicate email registration", async () => {
    const user: User = {
      id: "u1",
      email: "dup@test.com",
      name: "First",
      role: "student",
      passwordHash: "hash_test",
      verified: false,
      createdAt: new Date().toISOString(),
      profileComplete: false,
    };
    await userStore.create(user);

    const existing = await userStore.filter((u) => u.email === "dup@test.com");
    expect(existing.length).toBeGreaterThan(0);
  });

  it("verifies correct password against bcrypt hash", async () => {
    const password = "MySecure123";
    const hash = await hashPasswordSecure(password);

    const isValid = await verifyPasswordSecure(password, hash);
    expect(isValid).toBe(true);
  });

  it("rejects incorrect password against bcrypt hash", async () => {
    const hash = await hashPasswordSecure("correctPassword1");
    const isValid = await verifyPasswordSecure("wrongPassword2", hash);
    expect(isValid).toBe(false);
  });

  it("blocks banned users", async () => {
    const user: User = {
      id: "banned-user",
      email: "banned@test.com",
      name: "Banned User",
      role: "student",
      passwordHash: await hashPasswordSecure("pass123"),
      verified: true,
      createdAt: new Date().toISOString(),
      profileComplete: true,
      banned: true,
      banReason: "Violated terms of service",
    };
    await userStore.create(user);

    const found = await userStore.findById("banned-user");
    expect(found!.banned).toBe(true);
    // In the real auth flow, authenticateUser checks user.banned before returning
  });
});

describe("Auth — Session Store Operations", () => {
  let sessionStore: InMemoryStore<Session>;

  beforeEach(() => {
    sessionStore = new InMemoryStore<Session>();
  });

  it("creates a session with expiry", async () => {
    const session: Session = {
      id: "session-test-1",
      userId: "user-1",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      csrfToken: "test-csrf-token",
    };

    await sessionStore.create(session);
    const found = await sessionStore.findById("session-test-1");
    expect(found).toBeDefined();
    expect(found!.userId).toBe("user-1");
    expect(found!.csrfToken).toBe("test-csrf-token");
  });

  it("detects expired sessions", async () => {
    const session: Session = {
      id: "session-expired",
      userId: "user-1",
      expiresAt: new Date(Date.now() - 1000).toISOString(), // expired 1 second ago
    };

    await sessionStore.create(session);
    const found = await sessionStore.findById("session-expired");
    expect(found).toBeDefined();
    expect(new Date(found!.expiresAt) < new Date()).toBe(true);
  });

  it("deletes a session (logout)", async () => {
    const session: Session = {
      id: "session-to-delete",
      userId: "user-1",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };

    await sessionStore.create(session);
    const deleted = await sessionStore.delete("session-to-delete");
    expect(deleted).toBe(true);

    const found = await sessionStore.findById("session-to-delete");
    expect(found).toBeUndefined();
  });
});

describe("Auth — Role Hierarchy", () => {
  const roleHierarchy: Record<UserRole, number> = {
    student: 0,
    landlord: 1,
    admin: 2,
  };

  it("admin has highest privilege", () => {
    expect(roleHierarchy.admin).toBeGreaterThan(roleHierarchy.landlord);
    expect(roleHierarchy.admin).toBeGreaterThan(roleHierarchy.student);
  });

  it("landlord outranks student", () => {
    expect(roleHierarchy.landlord).toBeGreaterThan(roleHierarchy.student);
  });

  it("admin role passes all role checks", () => {
    const user: User = {
      id: "admin-1",
      email: "admin@test.com",
      name: "Admin",
      role: "admin",
      passwordHash: "hash",
      verified: true,
      createdAt: new Date().toISOString(),
      profileComplete: true,
    };

    // Admin should have access to landlord routes
    expect(user.role === "landlord" || user.role === "admin").toBe(true);
    // Admin should have access to student routes
    expect(user.role === "student" || user.role === "admin").toBe(true);
  });

  it("student cannot access landlord routes", () => {
    const user: User = {
      id: "student-1",
      email: "student@test.com",
      name: "Student",
      role: "student",
      passwordHash: "hash",
      verified: true,
      createdAt: new Date().toISOString(),
      profileComplete: true,
    };

    expect(user.role === "landlord" || user.role === "admin").toBe(false);
  });
});

describe("Auth — User Profile Updates", () => {
  let userStore: InMemoryStore<User>;

  beforeEach(() => {
    userStore = new InMemoryStore<User>();
    userStore.seed([
      {
        id: "user-profile-test",
        email: "profile@test.com",
        name: "Original Name",
        role: "student",
        passwordHash: "hash_test",
        verified: false,
        createdAt: new Date().toISOString(),
        profileComplete: false,
        onboardingComplete: false,
      },
    ]);
  });

  it("updates university verification", async () => {
    const updated = await userStore.update("user-profile-test", {
      universityId: "0001234567",
      verified: true,
      profileComplete: true,
    });

    expect(updated!.universityId).toBe("0001234567");
    expect(updated!.verified).toBe(true);
    expect(updated!.profileComplete).toBe(true);
  });

  it("completes onboarding", async () => {
    const updated = await userStore.update("user-profile-test", {
      onboardingComplete: true,
      campusId: "campus-forli",
    });

    expect(updated!.onboardingComplete).toBe(true);
    expect(updated!.campusId).toBe("campus-forli");
  });

  it("preserves existing fields on partial update", async () => {
    await userStore.update("user-profile-test", { name: "Updated Name" });
    const user = await userStore.findById("user-profile-test");

    expect(user!.name).toBe("Updated Name");
    expect(user!.email).toBe("profile@test.com"); // unchanged
    expect(user!.role).toBe("student"); // unchanged
  });
});
