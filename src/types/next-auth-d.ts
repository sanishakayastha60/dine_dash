import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "BUSINESS" | "SUPERADMIN";
    } & DefaultSession["user"];
    name?: string | null;
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "BUSINESS" | "SUPERADMIN";
  }
}
