import type { NextRequest } from "next/server";
import NextAuth from "next-auth/next";
import { getAuthOptions } from "@/lib/auth";

type NextAuthHandler = typeof NextAuth;

type RouteHandler = (
  req: NextRequest,
  ctx: { params: Promise<{ nextauth: string[] }> }
) => ReturnType<NextAuthHandler>;

const handler = NextAuth(getAuthOptions());

export const GET: RouteHandler = handler;
export const POST: RouteHandler = handler;
