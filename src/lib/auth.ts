import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authPaths = {
  signIn: "/login",
};

export function getAuthOptions(): NextAuthOptions {
  return {
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: authPaths.signIn,
    },
    providers: [
      CredentialsProvider({
        name: "Email",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "you@example.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const email = credentials?.email?.trim().toLowerCase();
          const password = credentials?.password;

          if (!email || !password) {
            throw new Error("Enter both email and password");
          }

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isValid = await compare(password, user.passwordHash);
          if (!isValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? user.email,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = (user as { id: string }).id;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user && token?.id) {
          session.user.id = token.id as string;
        }
        return session;
      },
    },
  };
}