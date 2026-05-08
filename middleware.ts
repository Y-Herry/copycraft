import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;

  const isDashboard =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.match(
      /^\/(generate|history|templates|subscription|settings)/
    );
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  console.log("[middleware]", req.nextUrl.pathname, {
    isLoggedIn,
    hasToken: !!token,
    cookies: req.cookies.getAll().map(c => c.name),
    secretExists: !!process.env.NEXTAUTH_SECRET,
  });

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/generate", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
