import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function getDashboard(role: unknown) {
  switch (role) {
    case "USER":
      return "/dashboard";

    case "BUSINESS":
      return "/business/dashboard";

    case "SUPERADMIN":
      return "/admin/dashboard";

    default:
      return "/login";
  }
}

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = req.nextUrl.pathname;

  if (!token) {
    const loginUrl = new URL("/login", req.url);

    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  const role = token.role;

  if (pathname.startsWith("/admin") && role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL(getDashboard(role), req.url));
  }

  if (pathname.startsWith("/business") && role !== "BUSINESS") {
    return NextResponse.redirect(new URL(getDashboard(role), req.url));
  }

  if (pathname.startsWith("/dashboard") && role !== "USER") {
    return NextResponse.redirect(new URL(getDashboard(role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/business/:path*", "/admin/:path*"],
};
