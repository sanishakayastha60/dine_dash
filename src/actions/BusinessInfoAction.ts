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

export async function getBusinessInfo() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "BUSINESS") {
      return {
        success: false,
        message: "Unauthorized",
        business: null,
      };
    }

    const business = await prisma.businessInfo.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!business) {
      return {
        success: false,
        message: "Business information not found",
        business: null,
      };
    }

    return {
      success: true,
      business,
    };
  } catch (error) {
    console.error("Get business info error:", error);

    return {
      success: false,
      message: "Failed to retrieve business information",
      business: null,
    };
  }
}

export async function updateBusinessInfo(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "BUSINESS") {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const address = formData.get("location") as string;
    const phoneNumber = formData.get("number") as string;
    const description = formData.get("description") as string;
    const businessType = formData.get("type") as BusinessType;
    const specialNotice = formData.get("specialNotice") as string;
    const coverUrl = formData.get("cover") as string;
    const logoUrl = formData.get("logo") as string;

    if (!id || !name?.trim() || !address?.trim()) {
      return {
        success: false,
        message: "Business ID, name and address are required.",
      };
    }

    if (!Object.values(BusinessType).includes(businessType)) {
      return {
        success: false,
        message: "Invalid business type.",
      };
    }

    // Verify that this business belongs to the logged-in user
    const existingBusiness = await prisma.businessInfo.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingBusiness) {
      return {
        success: false,
        message: "Business information not found.",
      };
    }

    // Update business information
    const business = await prisma.businessInfo.update({
      where: {
        id: existingBusiness.id,
      },
      data: {
        name: name.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber?.trim() || "",
        description: description?.trim() || null,
        businessType,
        specialNotice: specialNotice?.trim() || null,
        coverUrl: coverUrl?.trim() || "",
        logoUrl: logoUrl?.trim() || "",
      },
    });

    revalidatePath("/business/profile");

    return {
      success: true,
      message: "Business profile updated successfully.",
      businessId: business.id,
    };
  } catch (error) {
    console.error("Update business error:", error);

    return {
      success: false,
      message: "Failed to update business information.",
    };
  }
}

export async function getAllBusinessInfo() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "SUPERADMIN") {
      return {
        success: false,
        message: "Unauthorized. SuperAdmin access required.",
        businesses: [],
      };
    }
    const businesses = await prisma.businessInfo.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      success: true,
      businesses,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to retrieve business information.",
      businesses: [],
    };
  }
}

export async function updateBusinessVerification(
  businessId: string,
  isVerified: boolean,
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "SUPERADMIN") {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    if (
      typeof businessId !== "string" ||
      !businessId.trim() ||
      typeof isVerified !== "boolean"
    ) {
      return {
        success: false,
        message: "Invalid verification data.",
      };
    }

    const existingBusiness = await prisma.businessInfo.findUnique({
      where: { id: businessId },
      select: { id: true },
    });

    if (!existingBusiness) {
      return {
        success: false,
        message: "Business not found.",
      };
    }
    const business = await prisma.businessInfo.update({
      where: {
        id: businessId,
      },
      data: {
        isVerified,
      },
      select: {
        id: true,
        isVerified: true,
      },
    });

    revalidatePath("/superadmin/business");

    return {
      success: true,
      message: "Verification status updated successfully.",
      isVerified: business.isVerified,
    };
  } catch (error) {
    console.error("Verification update error:", error);

    return {
      success: false,
      message: "Failed to update verification status.",
    };
  }
}
