import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        identifier: {
          label: "Email or Phone",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            return null;
          }
          const identifier = credentials?.identifier.trim().toLowerCase();

          const user = await prisma.user.findFirst({
            where: {
              email: {
                equals: identifier,
                mode: "insensitive",
              },
            },
          });

          if (!user) return null;

          if (!user.password) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("AUTHORIZATION ERROR:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "business-credentials",
      name: "Business Login",

      credentials: {
        identifier: {
          label: "Email or Phone",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const identifier = credentials?.identifier;
        const password = credentials?.password;

        if (typeof identifier !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.trim().toLowerCase() },
              { phone: identifier.trim() },
            ],
            role: "BUSINESS",
          },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "BUSINESS" | "SUPERADMIN";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
