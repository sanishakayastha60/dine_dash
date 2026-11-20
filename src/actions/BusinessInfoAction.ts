"use server";
import { BusinessType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBusinessInfo(formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;
    const address = formData.get("location") as string;
    const phoneNumber = formData.get("number") as string;
    const description = formData.get("description") as string;
    const businessType = formData.get("type") as BusinessType;
    const coverUrl = formData.get("cover") as string;
    const logoUrl = formData.get("logo") as string;

    const data = {
      name,
      description,
      address,
      phoneNumber,
      businessType,
      coverUrl,
      logoUrl,
    };
    const business = id
      ? await prisma.businessInfo.update({
          where: { id },
          data,
        })
      : await prisma.businessInfo.create({
          data,
        });
    revalidatePath("/business/profile");
    return {
      success: true,
      message: "Business saved successfully",
      businessId: business.id,
    };
  } catch (error) {
    console.error("Save business error:", error);
  }
}
