import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { z } from "zod";
import { generateKey } from "crypto";
import { randomUUID } from "crypto";

const statusSchema = z.object({
  status: z.enum(["ACCEPTED", "PREPARING", "READY", "COMPLETED", "REJECTED"]),
});

const transitions = {
  PENDING: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["PREPARING", "REJECTED"],
  PREPARING: ["READY"],
  READY: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: [],
} as const;

function generateToken() {
  return `PICK-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "BUSINESS") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const validation = statusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const business = await prisma.businessInfo.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json(
        { message: "Business not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.businessOrder.findFirst({
        where: {
          id,
          businessId: business.id,
        },
      });

      if (!existingOrder) {
        throw new Error("ORDER_NOT_FOUND");
      }

      const allowed = transitions[existingOrder.status];

      if (!allowed.includes(validation.data.status as never)) {
        throw new Error("INVALID_STATUS_TRANSITION");
      }

      return tx.businessOrder.update({
        where: { id },
        data: {
          status: validation.data.status,
          ...(validation.data.status === "ACCEPTED" && {
            tokenNumber: existingOrder.tokenNumber ?? generateToken(),
          }),
        },
        include: {
          items: true,
          order: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Order status updated",
      order: updated,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 },
        );
      }

      if (error.message === "INVALID_STATUS_TRANSITION") {
        return NextResponse.json(
          { message: "Invalid order status transition" },
          { status: 400 },
        );
      }
    }

    console.error("UPDATE BUSINESS ORDER ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 },
    );
  }
}
