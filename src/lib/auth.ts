import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authPaths = {
  signIn: "/login",
} as const;

type NextAuthHandler = typeof import("next-auth/next")["default"];
type AuthOptions = Parameters<NextAuthHandler>[0];
type DefinedCallbacks = NonNullable<AuthOptions["callbacks"]>;
type JwtCallbackParams = DefinedCallbacks extends { jwt: (...args: infer A) => unknown }
  ? A[0]
  : never;
type SessionCallbackParams = DefinedCallbacks extends { session: (...args: infer A) => unknown }
  ? A[0]
  : never;

type SessionToken = SessionCallbackParams extends { token: infer T } ? T & { id?: string } : { id?: string };
type SessionUser = SessionCallbackParams extends { session: { user: infer U } } ? U & { id?: string } : { id?: string };

type AuthCallbacks = NonNullable<AuthOptions["callbacks"]>;

const authOptions: AuthOptions = {
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
    async jwt({ token, user }: JwtCallbackParams) {
      if (user) {
        (token as SessionToken).id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }: SessionCallbackParams) {
      if (session.user && (token as SessionToken).id) {
        (session.user as SessionUser).id = (token as SessionToken).id;
      }
      return session;
    },
  } satisfies Partial<AuthCallbacks>,
};

export function getAuthOptions(): AuthOptions {
  return authOptions;
}

export { authOptions };

