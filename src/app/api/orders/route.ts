import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { z } from "zod";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2).max(80).optional(),
  customerPhone: z.string().trim().min(7).max(20).optional(),
});

function generateOrderNumber() {
  return `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function generateToken() {
  return `PICK-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate customer
    const user = await getCurrentUser();

    if (!user || user.role !== "USER") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 },
      );
    }

    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid customer information",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        // 3. Get customer information
        const customer = await tx.user.findUnique({
          where: { id: user.id },
          select: {
            name: true,
            phone: true,
          },
        });

        if (!customer) {
          throw new Error("CUSTOMER_NOT_FOUND");
        }

        const customerName = validation.data.customerName || customer.name;

        const customerPhone = validation.data.customerPhone || customer.phone;

        if (!customerName || !customerPhone) {
          throw new Error("CUSTOMER_INFORMATION_REQUIRED");
        }

        // 4. Retrieve cart directly from database
        const cart = await tx.cart.findUnique({
          where: {
            userId: user.id,
          },
          include: {
            items: {
              include: {
                menuItem: {
                  include: {
                    business: true,
                  },
                },
              },
            },
          },
        });

        if (!cart || cart.items.length === 0) {
          throw new Error("CART_EMPTY");
        }

        // 5. Validate menu availability
        const unavailableItems = cart.items.filter(
          (item) => !item.menuItem.isAvailable,
        );

        if (unavailableItems.length > 0) {
          throw new Error("ITEMS_UNAVAILABLE");
        }

        // 6. Group items by restaurant
        const groupedItems = new Map<string, typeof cart.items>();

        for (const item of cart.items) {
          const businessId = item.menuItem.businessId;

          const existing = groupedItems.get(businessId) || [];

          existing.push(item);

          groupedItems.set(businessId, existing);
        }

        // 7. Calculate prices using database values
        const restaurantGroups = Array.from(groupedItems.entries()).map(
          ([businessId, items]) => {
            const restaurantTotal = items.reduce((total, item) => {
              const price = new Prisma.Decimal(item.menuItem.price.toString());

              return total.plus(price.mul(item.quantity));
            }, new Prisma.Decimal(0));

            return {
              businessId,
              items,
              totalAmount: restaurantTotal,
            };
          },
        );

        const grandTotal = restaurantGroups.reduce(
          (total, restaurant) => total.plus(restaurant.totalAmount),
          new Prisma.Decimal(0),
        );

        // 8. Create master order
        const order = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            userId: user.id,
            customerName,
            customerPhone,
            totalAmount: grandTotal,
            paymentMethod: "CASH",
            paymentStatus: "PENDING",
          },
        });

        // 9. Create separate orders for each restaurant
        for (const restaurant of restaurantGroups) {
          await tx.businessOrder.create({
            data: {
              tokenNumber: generateToken(),
              orderId: order.id,
              businessId: restaurant.businessId,
              totalAmount: restaurant.totalAmount,

              items: {
                create: restaurant.items.map((item) => ({
                  menuItemId: item.menuItemId,
                  menuItemName: item.menuItem.name,
                  quantity: item.quantity,
                  price: new Prisma.Decimal(item.menuItem.price.toString()),
                })),
              },
            },
          });
        }

        // 10. Clear cart only after successful order creation
        await tx.cartItem.deleteMany({
          where: {
            cartId: cart.id,
          },
        });

        // 11. Return created order
        return tx.order.findUnique({
          where: {
            id: order.id,
          },
          include: {
            businessOrders: {
              include: {
                business: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                items: true,
              },
            },
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    return NextResponse.json(
      {
        message: "Order placed successfully",
        order: result,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "CUSTOMER_NOT_FOUND":
          return NextResponse.json(
            { message: "Customer not found" },
            { status: 404 },
          );

        case "CUSTOMER_INFORMATION_REQUIRED":
          return NextResponse.json(
            {
              message: "Please provide your name and phone number",
            },
            { status: 400 },
          );

        case "CART_EMPTY":
          return NextResponse.json(
            { message: "Your cart is empty" },
            { status: 400 },
          );

        case "ITEMS_UNAVAILABLE":
          return NextResponse.json(
            {
              message: "Some items are unavailable. Please update your cart.",
            },
            { status: 400 },
          );
      }
    }

    console.error("PLACE ORDER ERROR:", error);

    return NextResponse.json(
      { message: "Failed to place order. Please try again." },
      { status: 500 },
    );
  }
}
