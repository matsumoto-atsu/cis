import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      name?: string;
      email?: string;
      password?: string;
    } | null;

    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    const password = body.password;
    const name = body.name?.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email format is invalid" }, { status: 400 });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}