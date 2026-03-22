import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Public admin pages — always allow
    if (pathname === "/admin/login" || pathname === "/admin/unauthorized") {
      return NextResponse.next();
    }

    // Authenticated but NOT admin → redirect to unauthorized page
    if (token && !token.isAdmin) {
      return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
    }

    // Prevent browser from caching admin pages.
    // Without this, after logout the browser can serve stale cached pages
    // making it look like the user is still logged in.
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Login and unauthorized pages don't require authentication
        if (pathname === "/admin/login" || pathname === "/admin/unauthorized") {
          return true;
        }

        // All other /admin/* pages require a valid token
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
