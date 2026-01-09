import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        const body = await req.json();
        const { name, description, start_date, end_date } = body;

        if (!name || !start_date || !end_date) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const project = await prisma.project.create({
            data: {
                name,
                description,
                startDate: new Date(start_date),
                endDate: new Date(end_date),
                userId,
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("CREATE_PROJECT_ERROR", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
