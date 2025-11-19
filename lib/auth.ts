import { UAParser } from "ua-parser-js";
import { betterAuth } from "better-auth";
import type { Session } from "@prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";


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
    sendVerificationEmail: async ({user, url}) => {
      const mailersend = new Mailersend({
        apiKey: env.MAILERSEND_API_KEY!,
      });
      await mailersend.send({
        from: {
          email: "no-reply@example.com",
          name: "Ganttatic",
        },
        to: [{
          email: user.email!,
          name: user.name!,
        }],
        subject: "Verify your email",
        html: `Click <a href="${url}">here</a> to verify your email.`,
      });
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
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