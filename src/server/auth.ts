import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    GitHub({
      clientId:
        process.env.NODE_ENV === "production"
          ? process.env.AUTH_GITHUB_ID
          : process.env.AUTH_GITHUB_LOCAL_ID,
      clientSecret:
        process.env.NODE_ENV === "production"
          ? process.env.AUTH_GITHUB_SECRET
          : process.env.AUTH_GITHUB_LOCAL_SECRET,
    }),
    Google,
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  // callbacks: {
  //   session: ({session }) => {
  //     session.
  //   }
  // },
  events: {
    createUser: async ({ user }) => {
      await stripe.customers
        .create({
          name: user.name!,
          email: user.email!,
          metadata: {
            userId: user.id!,
          },
        })
        .then(async (customer) => {
          return prisma.user.update({
            where: {
              id: user.id,
            },
            data: { stripeCustomerId: customer.id },
            select: {},
          });
        });
    },
  },
});
