import NextAuth from "next-auth/next";
import { getAuthOptions } from "@/lib/auth";

const authOptions = getAuthOptions();

const handler = (NextAuth as unknown as (options: typeof authOptions) => ReturnType<typeof NextAuth>)(
  authOptions,
);

export { handler as GET, handler as POST };
