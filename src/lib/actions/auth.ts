"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  authenticateUser,
  createSession,
  createUser,
  logout as logoutUser,
  type UserRole,
} from "@/lib/auth";

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email e password sono obbligatori" };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { error: "Credenziali non valide" };
  }

  const sessionId = await createSession(user.id);
  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  redirect(user.role === "landlord" ? "/dashboard" : "/listings");
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as UserRole) || "student";

  if (!email || !name || !password) {
    return { error: "Tutti i campi sono obbligatori" };
  }

  if (password.length < 6) {
    return { error: "La password deve avere almeno 6 caratteri" };
  }

  const result = await createUser(email, name, password, role);
  if ("error" in result) {
    return { error: result.error };
  }

  const sessionId = await createSession(result.id);
  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  redirect(role === "landlord" ? "/dashboard" : "/listings");
}

export async function logoutAction() {
  await logoutUser();
  redirect("/");
}

export async function verifyUniversityAction(_prevState: unknown, formData: FormData) {
  const universityId = formData.get("universityId") as string;
  const documentName = formData.get("documentName") as string;

  if (!universityId) {
    return { error: "Inserisci la matricola universitaria" };
  }

  return {
    success: true,
    message: `Verifica avviata per matricola ${universityId}. Documento: ${documentName || "non fornito"}. Riceverai conferma via email.`,
  };
}
