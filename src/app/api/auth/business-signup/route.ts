import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { ownerName, email, phone, password } = await req.json();

    if (
      !ownerName?.trim() ||
      !phone?.trim() ||
      !password ||
      (!email?.trim() && !phone?.trim())
    ) {
      return NextResponse.json(
        { message: "Please provide all required fields" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const normalizedEmail = email?.trim().toLowerCase() || null;
    const normalizedPhone = phone.trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          { phone: normalizedPhone },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email or phone already registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: ownerName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        role: "BUSINESS",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: "Business account registered successfully",
        user,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Business signup error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Email or phone already registered" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
