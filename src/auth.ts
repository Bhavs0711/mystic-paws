import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
        session.user.hasUsedFreeReading =
          (user as { hasUsedFreeReading?: boolean }).hasUsedFreeReading ?? false;
      }
      return session;
    },
    async signIn({ user }) {
      // Auto-grant admin to the configured admin email
      if (user.email === process.env.ADMIN_EMAIL) {
        await prisma.user.update({
          where: { email: user.email },
          data: { isAdmin: true },
        }).catch(() => null); // May not exist yet on first sign-in
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
  },
  session: { strategy: "database" },
});
