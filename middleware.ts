import { NextResponse, type NextRequest } from "next/server";

const publicAuthPages = [
  "/sign-in",
  "/register",
  "/verify-email-alert",
  "/email-verified",
];

const AUTH_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export default function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = AUTH_COOKIES
    .map((name) => request.cookies.get(name))
    .find(Boolean);

  const isAuthPage = publicAuthPages.some((path) =>
    pathname.startsWith(path)
  );

  const isApiAuthRoute = pathname.startsWith("/api/auth");

  if (!sessionCookie && !isAuthPage && !isApiAuthRoute) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
