import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type UserRole = "USER" | "BUSINESS" | "SUPERADMIN";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      businessInfo: true,
    },
  });

  return user;
}

function getDashboardByRole(role: UserRole): string {
  switch (role) {
    case "USER":
      return "/dashboard";

    case "BUSINESS":
      return "/business/dashboard";

    case "SUPERADMIN":
      return "/admin/dashboard";
  }
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getCurrentUser();

  // Not authenticated or user deleted
  if (!user) {
    redirect("/login");
  }

  // Verify current role from database
  if (!allowedRoles.includes(user.role)) {
    redirect(getDashboardByRole(user.role));
  }

  return user;
}

export async function requireAdmin() {
  return requireRole(["SUPERADMIN"]);
}

export async function requireBusiness() {
  return requireRole(["BUSINESS"]);
}

export async function requireUser() {
  return requireRole(["USER"]);
}
