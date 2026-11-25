"use server";
import { prisma } from "@/lib/prisma";

export async function getFoodItem(id: string) {
  const product = await prisma.foodItem.findUnique({
    where: {
      id: id,
    },
  });
  return product;
}
