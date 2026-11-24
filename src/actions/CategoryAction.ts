"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const business = await prisma.businessInfo.findFirst();

    if (!business) {
      return {
        success: false,
        message: "Business information not found",
        categories: [],
      };
    }

    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        businesses: {
          where: {
            businessInfoId: business.id,
          },
        },
      },
    });

    return {
      success: true,
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        isSelected: category.businesses.length > 0,
      })),
    };
  } catch (error) {
    console.error("Get categories error:", error);

    return {
      success: false,
      message: "Failed to fetch categories",
      categories: [],
    };
  }
}

export async function toggleCategory(categoryId: string) {
  try {
    const business = await prisma.businessInfo.findFirst();

    if (!business) {
      return {
        success: false,
        message: "Business information not found",
      };
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    const existing = await prisma.businessCategory.findUnique({
      where: {
        businessInfoId_categoryId: {
          businessInfoId: business.id,
          categoryId,
        },
      },
    });

    if (existing) {
      await prisma.businessCategory.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.businessCategory.create({
        data: {
          businessInfoId: business.id,
          categoryId,
        },
      });
    }

    revalidatePath("/categories");
    revalidatePath("/menu");

    return {
      success: true,
      message: existing ? "Category deselected" : "Category selected",
    };
  } catch (error) {
    console.error("Toggle category error:", error);

    return {
      success: false,
      message: "Failed to update category",
    };
  }
}

export async function getSelectedCategories() {
  try {
    const business = await prisma.businessInfo.findFirst();

    if (!business) {
      return {
        success: false,
        categories: [],
      };
    }

    const selectedCategories = await prisma.businessCategory.findMany({
      where: {
        businessInfoId: business.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        category: {
          name: "asc",
        },
      },
    });

    return {
      success: true,
      categories: selectedCategories.map((item) => item.category),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      categories: [],
    };
  }
}
