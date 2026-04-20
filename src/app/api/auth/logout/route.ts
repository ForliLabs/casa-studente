import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionStore } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (sessionId) {
    await sessionStore.delete(sessionId);
    cookieStore.delete("session_id");
  }
  redirect("/");
}
