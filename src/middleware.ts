import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "sp_access_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  // If logged in and visiting sign-in, redirect to admin
  if (token && pathname.startsWith("/auth/sign-in")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Redirect root to /admin dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If not logged in, redirect to sign-in with callbackUrl
  if (!token) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - /auth/* (login pages)
     * - /_next/* (Next.js internals)
     * - /images/* (static images)
     * - favicon.ico, .svg, .png, etc. (static files)
     */
    "/((?!auth|_next|images|favicon\\.ico|.*\\.).*)",
  ],
};
