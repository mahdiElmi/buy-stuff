import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
  throw new Error("Missing AUTH_GITHUB_ID or AUTH_GITHUB_SECRET");
}
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}

export const authInstance = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId:
        process.env.NODE_ENV === "production"
          ? process.env.AUTH_GITHUB_ID
          : process.env.AUTH_GITHUB_LOCAL_ID!,
      clientSecret:
        process.env.NODE_ENV === "production"
          ? process.env.AUTH_GITHUB_SECRET
          : process.env.AUTH_GITHUB_LOCAL_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const customer = await stripe.customers.create({
            name: user.name,
            email: user.email,
            metadata: { userId: user.id },
          });
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customer.id },
          });
        },
      },
    },
  },
});

// 🪄 Wrapper to mimic NextAuth's auth() function
export async function auth(customHeaders?: Headers) {
  return authInstance.api.getSession({
    headers: customHeaders || (await headers()),
  });
}

// 🪄 Wrapper to mimic NextAuth's signIn() function
export async function signIn(
  provider: "github" | "google",
  options?: { redirectTo?: string },
) {
  const res = await authInstance.api.signInSocial({
    body: {
      provider,
      callbackURL: options?.redirectTo || "/",
    },
    headers: await headers(),
  });
  if (res?.url) {
    redirect(res.url as any);
  }
}

// 🪄 Wrapper to mimic NextAuth's signOut() function
export async function signOut(options?: { redirectTo?: string }) {
  await authInstance.api.signOut({
    headers: await headers(),
  });
  if (options?.redirectTo) {
    redirect(options.redirectTo as any);
  }
}
