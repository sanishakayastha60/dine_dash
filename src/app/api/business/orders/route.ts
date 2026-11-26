import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
  try {
    // 1. Authenticate business owner
    const user = await getCurrentUser();

    if (!user || user.role !== "BUSINESS") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Find business associated with logged-in user
    const business = await prisma.businessInfo.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { message: "Business not found" },
        { status: 404 },
      );
    }

    // 3. Get orders belonging to this business
    const orders = await prisma.businessOrder.findMany({
      where: {
        businessId: business.id,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            paymentMethod: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
        items: {
          select: {
            id: true,
            menuItemId: true,
            menuItemName: true,
            quantity: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      business,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET BUSINESS ORDERS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch business orders" },
      { status: 500 },
    );
  }
}
