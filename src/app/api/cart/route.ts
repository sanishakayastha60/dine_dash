import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "USER") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
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

    return NextResponse.json({
      cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "USER") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { menuItemId, quantity = 1 } = body;

    if (
      typeof menuItemId !== "string" ||
      !menuItemId.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return NextResponse.json(
        { message: "Invalid menu item or quantity" },
        { status: 400 },
      );
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      select: {
        id: true,
        isAvailable: true,
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { message: "Food item not found" },
        { status: 404 },
      );
    }

    if (!menuItem.isAvailable) {
      return NextResponse.json(
        { message: "This food item is unavailable" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: { userId: user.id },
        create: { userId: user.id },
        update: {},
      });

      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_menuItemId: {
            cartId: cart.id,
            menuItemId,
          },
        },
        select: {
          quantity: true,
        },
      });

      if ((existingItem?.quantity ?? 0) + quantity > 99) {
        throw new Error("MAX_QUANTITY_EXCEEDED");
      }

      return tx.cartItem.upsert({
        where: {
          cartId_menuItemId: {
            cartId: cart.id,
            menuItemId,
          },
        },
        create: {
          cartId: cart.id,
          menuItemId,
          quantity,
        },
        update: {
          quantity: {
            increment: quantity,
          },
        },
        include: {
          menuItem: {
            include: {
              business: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        message: "Item added to cart",
        item: result,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "MAX_QUANTITY_EXCEEDED") {
      return NextResponse.json(
        { message: "Maximum quantity is 99" },
        { status: 400 },
      );
    }

    console.error("ADD TO CART ERROR:", error);

    return NextResponse.json(
      { message: "Failed to add item" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "USER") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { menuItemId, quantity } = body;

    if (
      typeof menuItemId !== "string" ||
      !menuItemId.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return NextResponse.json(
        { message: "Invalid quantity" },
        { status: 400 },
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const result = await prisma.cartItem.updateMany({
      where: {
        cartId: cart.id,
        menuItemId,
      },
      data: { quantity },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update cart" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "USER") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { menuItemId } = body;

    if (typeof menuItemId !== "string" || !menuItemId.trim()) {
      return NextResponse.json(
        { message: "Invalid menu item" },
        { status: 400 },
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const result = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        menuItemId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("REMOVE CART ITEM ERROR:", error);

    return NextResponse.json(
      { message: "Failed to remove item" },
      { status: 500 },
    );
  }
}
