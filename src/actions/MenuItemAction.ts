"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { MenuSection } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMenuItem(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const estimatedTime = Number(formData.get("estimatedTime") as string);
    const menuSection = formData.get("menuSection") as MenuSection;
    const categoryId = formData.get("foodCategory") as string;
    const imageUrl = formData.get("dishImage") as string;

    if (!name || !menuSection || !categoryId) {
      return {
        success: false,
        message: "Please fill all required fields.",
      };
    }
    if (!Number.isFinite(price) || price <= 0) {
      return {
        success: false,
        message: "Invalid price.",
      };
    }
    const business = await prisma.businessInfo.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });
    if (!business) {
      return {
        success: false,
        message: "Business profile not found.",
      };
    }
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      return {
        success: false,
        message: "Category not found.",
      };
    }
    await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price,
        estimatedTime,
        menuSection: menuSection as MenuSection,
        imageUrl: imageUrl || null,

        category: {
          connect: { id: categoryId },
        },

        business: {
          connect: { id: business.id },
        },
      },
    });

    revalidatePath("/business/menu");

    return {
      success: true,
      message: "Menu item created successfully!",
    };
  } catch (e) {
    console.error(e);
  }
}

export async function getMenuItems() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        menuItems: [],
      };
    }

    const business = await prisma.businessInfo.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!business) {
      return {
        success: false,
        message: "Business not found",
        menuItems: [],
      };
    }
    const menuItems = await prisma.menuItem.findMany({
      where: {
        businessId: business.id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      menuItems,
    };
  } catch (error) {
    console.error("Get menu items error:", error);

    return {
      success: false,
      message: "Failed to fetch menu items",
      menuItems: [],
    };
  }
}
export async function getLandingPageMenuItems() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        business: {
          isVerified: true,
        },
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      menuItems,
    };
  } catch (error) {
    console.error("Landing page menu error:", error);

    return {
      success: false,
      menuItems: [],
    };
  }
}

export async function getAllPublicMenuItems() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        business: {
          isVerified: true,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            address: true,
            logoUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      menuItems,
    };
  } catch (error) {
    console.error("Get all public menu items error:", error);

    return {
      success: false,
      message: "Failed to fetch food items.",
      menuItems: [],
    };
  }
}
