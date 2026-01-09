// lib/session-middleware.ts
import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { HonoEnv } from "./hono-env";

export const sessionMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const token = getCookie(c, AUTH_COOKIE);

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const session = await auth.api.getSession({
    headers: {
      cookie: `${AUTH_COOKIE}=${token}`,
    },
  });

  if (!session?.user) {
    return c.json({ error: "Session expired" }, 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return c.json({ error: "User not found" }, 401);
  }

  c.set("user", user);
  c.set("db", prisma);

  await next();
});
