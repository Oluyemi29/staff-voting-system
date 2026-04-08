import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import type { Admin, User } from "@prisma/client";

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        staffid: { label: "staffid", type: "text", placeholder: "12345678" },
        email: { label: "Email", type: "email", placeholder: "joe@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const staffId = credentials?.staffid;
        const userEmail = credentials?.email;
        const userPassword = credentials?.password;
        if (!userPassword) {
          return null;
        }
        if (!staffId && !userEmail) {
          return null;
        }
        if (staffId) {
          const user = await prisma.user.findUnique({
            where: {
              staffid: staffId,
            },
          });
          if (user) {
            const checkPassword = await bcrypt.compare(
              userPassword,
              user.password,
            );
            if (checkPassword) {
              return user;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else if (userEmail) {
          const user = await prisma.admin.findUnique({
            where: {
              email: userEmail,
            },
          });
          if (user) {
            const checkPassword = await bcrypt.compare(
              userPassword,
              user.password,
            );
            if (checkPassword && user.role === "ADMIN") {
              return user;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.user = user as User & Admin;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      if (token) {
        session.user = token.user;
      }
      session.user.password = "";
      return session;
    },
  },
};

const Handlers = NextAuth(authOptions as AuthOptions);

export { Handlers as GET, Handlers as POST };
