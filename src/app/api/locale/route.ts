import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getLocaleFromCookie } from "@/lib/i18n";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { locale?: string } | null;
  const locale = getLocaleFromCookie(body?.locale);

  const cookieStore = await cookies();
  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
  });

  return NextResponse.json({ success: true, locale });
}
