import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema } from "../schema";

const app = new Hono()
    .post(
        "/",
        sessionMiddleware,
        zValidator("json", createProjectSchema),
        async (c) => {
            const db = c.get("db");
            const user = c.get("user");
            const { name, description, start_date, end_date } = c.req.valid("json");

            const project = await db.project.create({
                data: {
                    name,
                    description,
                    startDate: start_date,
                    endDate: end_date,
                    userId: user.id,
                }
            })

            return c.json({ data: project })
        }
    );

export default app;