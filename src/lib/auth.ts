import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authPaths = {
  signIn: "/login",
} as const;

type TokenWithId = { id?: string } & Record<string, unknown>;
type SessionUserWithId = { id?: string } & Record<string, unknown>;

type JwtCallbackArgs = {
  token: TokenWithId;
  user?: { id: string } | null;
};

type SessionCallbackArgs = {
  session: { user?: SessionUserWithId } & Record<string, unknown>;
  token: TokenWithId;
};

export const authOptions = {
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
    async jwt({ token, user }: JwtCallbackArgs) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: SessionCallbackArgs) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export function getAuthOptions() {
  return authOptions;
}
