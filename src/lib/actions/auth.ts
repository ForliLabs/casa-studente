"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  authenticateUser,
  createSession,
  createUser,
  getCurrentUser,
  logout as logoutUser,
  type UserRole,
  userStore,
} from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// ============ Zod Schemas ============

const loginSchema = z.object({
  email: z.string().email("Email non valida").max(255),
  password: z.string().min(1, "Password obbligatoria").max(128),
});

const registerSchema = z.object({
  email: z.string().email("Email non valida").max(255),
  name: z.string().min(2, "Nome troppo corto").max(100).trim(),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri").max(128),
  role: z.enum(["student", "landlord"]).default("student"),
});

const verifySchema = z.object({
  universityId: z.string().min(1, "Inserisci la matricola universitaria").max(20),
  documentName: z.string().max(255).optional(),
});

// ============ Actions ============

export async function loginAction(_prevState: unknown, formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { email, password } = result.data;

  // Rate limit by email
  const { allowed } = checkRateLimit(`auth:${email}`, RATE_LIMITS.auth);
  if (!allowed) {
    return { error: "Troppi tentativi. Riprova tra 15 minuti." };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { error: "Credenziali non valide" };
  }

  const { sessionId, csrfToken } = await createSession(user.id);
  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  cookieStore.set("csrf_token", csrfToken, {
    httpOnly: false, // Accessible to JS for form submission
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  redirect(user.onboardingComplete ? (user.role === "landlord" ? "/dashboard" : "/listings") : "/onboarding");
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    name: formData.get("name") as string,
    password: formData.get("password") as string,
    role: (formData.get("role") as string) || "student",
  };

  const result = registerSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { email, name, password, role } = result.data;

  const userResult = await createUser(email, name, password, role as UserRole);
  if ("error" in userResult) {
    return { error: userResult.error };
  }

  const { sessionId, csrfToken } = await createSession(userResult.id);
  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  cookieStore.set("csrf_token", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  redirect("/onboarding");
}

export async function logoutAction() {
  await logoutUser();
  redirect("/");
}

export async function verifyUniversityAction(_prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per completare la verifica" };
  }

  const document = formData.get("document") as File | null;
  const raw = {
    universityId: formData.get("universityId") as string,
    documentName:
      typeof document?.name === "string" && document.name.length > 0
        ? document.name
        : ((formData.get("documentName") as string) || ""),
  };

  const result = verifySchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { universityId, documentName } = result.data;

  await userStore.update(user.id, {
    universityId,
    universityDocument: documentName || undefined,
    verified: true,
    profileComplete: true,
  });

  return {
    success: true,
    message: `Verifica completata per matricola ${universityId}. Documento registrato: ${documentName || "non fornito"}. Il badge verificato è ora attivo.`,
  };
}
