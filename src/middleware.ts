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

  // Protected admin routes: redirect to sign-in if not authenticated
  if (pathname.startsWith("/admin") && !token) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match only:
     * - /admin/* (protected dashboard routes)
     * - /auth/* (login pages — for redirect-if-logged-in logic)
     */
    "/(admin|auth)(.*)",
  ],
};
