import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge Middleware — security headers + auth session validation.
 * Runs on every request before reaching the page/API route.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ============ Security Headers ============
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), interest-cohort=()"
  );

  // HSTS — only in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.stripe.com https://*.vercel-storage.com",
    "connect-src 'self' https://api.stripe.com https://*.sentry.io https://*.posthog.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // ============ Protected Routes ============
  const protectedPaths = ["/dashboard", "/admin"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    const sessionId = request.cookies.get("session_id")?.value;
    if (!sessionId) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Admin routes — additional check (role enforcement happens server-side)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionId = request.cookies.get("session_id")?.value;
    if (!sessionId) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and API health
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|api/health).*)",
  ],
};
