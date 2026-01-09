
import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";
export type HonoEnv = {
  Variables: {
    db: typeof prisma;
    user: User
  };
};
