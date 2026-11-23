"use server";

import { MenuSection } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function createMenuItem(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const estimatedTime = Number(formData.get("estimatedTime") as string);
    const menuSection = formData.get("menuSection") as MenuSection;
    const foodCategory = formData.get("foodCategory") as string;
    const imageUrl = formData.get("dishImage") as string;
  } catch (e) {
    console.error(e);
  }
}
