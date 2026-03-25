import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// ---------------------------------------------------------------------------
// In-memory sliding-window rate limiter (per Lambda instance)
// ---------------------------------------------------------------------------
const hits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 100; // per IP per window

function checkRateLimit(ip: string): { limited: boolean; remaining: number } {
  const now = Date.now();
  const entry = hits.get(ip);

  // New IP or expired window → reset
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, remaining: MAX_REQUESTS - 1 };
  }

  entry.count++;

  // Prevent the map from growing unbounded (cleanup stale entries when large)
  if (hits.size > 10_000) {
    for (const [key, val] of hits) {
      if (now > val.resetAt) hits.delete(key);
    }
  }

  return {
    limited: entry.count > MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
  };
}

// ---------------------------------------------------------------------------
// Proxy
// ---------------------------------------------------------------------------
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Rate limiting (all routes) ---
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { limited, remaining } = checkRateLimit(ip);

  if (limited) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
        "X-RateLimit-Limit": String(MAX_REQUESTS),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  // --- Admin route protection ---
  if (pathname.startsWith("/admin")) {
    // Public admin pages — no auth needed
    if (pathname === "/admin/login" || pathname === "/admin/unauthorized") {
      return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Not authenticated → login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Authenticated but not admin → unauthorized
    if (!token.isAdmin) {
      return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
    }

    // Admin OK — add anti-cache headers
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  }

  // --- All other routes — just pass through with rate limit header ---
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response;
}

// Match all routes except static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
