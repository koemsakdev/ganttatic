import { UAParser } from "ua-parser-js";
import { betterAuth } from "better-auth";
import type { Session } from "@prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { SendEmail } from "@/emails/send-email";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // const verificationUrl = url.replace("/api", "");
      console.log(url)
      await SendEmail({ user, url });
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  callbacks: {
    async sessionCreate({
      session,
      request,
    }: {
      session: Session;
      request: Request;
    }) {
      const forwardedFor = request.headers.get("x-forwarded-for");
      const ip = forwardedFor?.split(",")[0]?.trim() || null;
      const userAgent = request.headers.get("user-agent") || "Unknown";
      const parser = new UAParser(userAgent);
      const browser = parser.getBrowser().name || "Unknown Browser";
      const os = parser.getOS().name || "Unknown OS";
      const deviceName = `${browser} on ${os}`;
      await prisma.session.update({
        where: { id: session.id },
        data: {
          ipAddress: ip,
          userAgent,
          deviceName
        },
      });
    },
  }
});