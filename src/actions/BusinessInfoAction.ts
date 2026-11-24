"use server";
import { BusinessType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createBusinessInfo(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }
    const name = formData.get("name") as string;
    const address = formData.get("location") as string;
    const phoneNumber = formData.get("number") as string;
    const description = formData.get("description") as string;
    const businessType = formData.get("type") as BusinessType;
    const coverUrl = formData.get("cover") as string;
    const logoUrl = formData.get("logo") as string;
    const specialNotice = formData.get("specialNotice") as string;

    if (!name?.trim() || !address?.trim()) {
      return {
        success: false,
        message: "Business name, address are required.",
      };
    }
    const business = await prisma.businessInfo.create({
      data: {
        name,
        description,
        address,
        phoneNumber,
        businessType,
        coverUrl,
        logoUrl,
        specialNotice: specialNotice.trim() || null,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    revalidatePath("/business/profile");

    return {
      success: true,
      message: "Business created successfully",
      businessId: business.id,
    };
  } catch (error) {
    console.error("Create business error:", error);

    return {
      success: false,
      message: "Failed to create business",
    };
  }
}

// export async function updateBusinessInfo(formData: FormData) {
//   try {
//     const id = formData.get("id") as string | null;
//     const name = formData.get("name") as string;
//     const address = formData.get("location") as string;
//     const phoneNumber = formData.get("number") as string;
//     const description = formData.get("description") as string;
//     const businessType = formData.get("type") as BusinessType;
//     const coverUrl = formData.get("cover") as string;
//     const logoUrl = formData.get("logo") as string;

//     const data = {
//       name,
//       description,
//       address,
//       phoneNumber,
//       businessType,
//       coverUrl,
//       logoUrl,
//     };
//     const business = await prisma.businessInfo.update({
//       where: { id },
//       data,
//     });
//     revalidatePath("/business/profile");
//     return {
//       success: true,
//       message: "Business saved successfully",
//       businessId: business.id,
//     };
//   } catch (error) {
//     console.error("Save business error:", error);
//   }
// }
