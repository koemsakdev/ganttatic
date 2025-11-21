import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
// 1. Import User type along with Session
import type { Session, User } from "better-auth/types";

const publicPaths = [
  "/sign-in",
  "/register",
  "/verify-email-alert",
  "/email-verified",
  "/api/auth", 
];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isPublic = publicPaths.some((path) => pathName.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  // 2. Update the Type Generic here
  // We tell TypeScript to expect an object with BOTH session and user
  const { data } = await betterFetch<{ session: Session; user: User }>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  // 3. Check if data exists (if null, they aren't logged in)
  if (!data) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 4. Now TypeScript knows 'data.user' exists!
  // Note: We access 'data.user', not 'session.user'
  if (!data.user.emailVerified) {
     return NextResponse.redirect(new URL("/verify-email-alert", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};