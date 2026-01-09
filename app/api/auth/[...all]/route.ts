import { Hono } from "hono";
import { handle } from "hono/vercel";
import arcjet from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import ip from "@arcjet/ip";
import {
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
  protectSignup,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

import projects from "@/features/gantt-chart/server/route";
/* ------------------------------------------------------------------ */
/* Hono app */
/* ------------------------------------------------------------------ */

const app = new Hono().basePath("/api");

const routes = app.route("/projects", projects);


/* ------------------------------------------------------------------ */
/* Arcjet config */
/* ------------------------------------------------------------------ */

const emailOptions = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const botOptions = {
  mode: "LIVE",
  allow: [],
} satisfies BotOptions;

const rateLimitOptions = {
  mode: "LIVE",
  interval: "2m",
  max: 5,
} satisfies SlidingWindowRateLimitOptions<[]>;

const signupOptions = {
  email: emailOptions,
  bots: botOptions,
  rateLimit: rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;

/* ------------------------------------------------------------------ */
/* Arcjet signup protection ONLY */
/* ------------------------------------------------------------------ */

async function protectSignupRequest(req: NextRequest) {
  const body = await req.clone().json();

  if (typeof body?.email !== "string") {
    return new Response("Invalid request", { status: 400 });
  }

  const decision = await arcjet
    .withRule(protectSignup(signupOptions))
    .protect(req, {
      email: body.email,
      fingerprint: ip(req) || "127.0.0.1",
    });

  if (!decision.isDenied()) return null;

  if (decision.reason.isRateLimit()) {
    return new Response(null, { status: 429 });
  }

  if (decision.reason.isEmail()) {
    let message = "Invalid email.";

    if (decision.reason.emailTypes.includes("INVALID")) {
      message = "Email address format is invalid.";
    } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
      message = "Disposable email addresses are not allowed.";
    } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
      message = "Email domain has no MX records.";
    }

    return Response.json({ message }, { status: 400 });
  }

  return new Response(null, { status: 403 });
}

/* ------------------------------------------------------------------ */
/* better-auth handlers */
/* ------------------------------------------------------------------ */

const authHandlers = toNextJsHandler(auth.handler);

/* ------------------------------------------------------------------ */
/* Unified Next.js route handlers */
/* ------------------------------------------------------------------ */

const honoHandler = handle(app);

export async function GET(req: NextRequest, ctx: any) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/auth")) {
    return authHandlers.GET(req);
  }

  return honoHandler(req, ctx);
}

/* ------------------------------------------------------------------ */
/* POST handler (OPTIMIZED) */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest, ctx: any) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/auth/sign-up")) {
    const blocked = await protectSignupRequest(req);
    if (blocked) return blocked;
  }

  if (pathname.startsWith("/api/auth")) {
    return authHandlers.POST(req);
  }

  return honoHandler(req, ctx);
}

export const PATCH = honoHandler;
export const DELETE = honoHandler;


export type AppType = typeof routes;