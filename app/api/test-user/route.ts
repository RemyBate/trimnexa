import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const user = await prisma.user.create({
        data: {
            email: `test${Date.now()}@trimnexa.com`,
            name: "Test User",
        },
    });

    return NextResponse.json({ ok: true, user });
}

export async function GET() {
    const users = await prisma.user.findMany({
        orderBy: { id: "desc" },
    });

    return NextResponse.json({ ok: true, users });
}
