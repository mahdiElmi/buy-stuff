import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "database" },
//   // session: {
//   //   strategy: "jwt",
//   // },
//   // Configure one or more authentication providers
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     GithubProvider({
//       clientId: process.env.GITHUB_ID as string,
//       clientSecret: process.env.GITHUB_SECRET as string,
//     }),

//     // ...add more providers here
//   ],

//   callbacks: {
//     session: ({ session, user }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),
//     //   async signIn({ account, profile }) {
//     //     if (!profile?.email) {
//     //       throw new Error("No profile");
//     //     }
//     //     await prisma.user.upsert({
//     //       where: { email: profile.email },
//     //       create: {
//     //         email: profile.email,
//     //         name: profile.name ? profile.name : "",
//     //         lastName: "",
//     //         profilePicURL: profile.image,
//     //       },
//     //       update: { name: profile.name ?? profile.name },
//     //     });
//     //     return true;
//     //   },
//   },
// } satisfies NextAuthOptions;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: "/sign-in",
  },
  providers: [GitHub, Google],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
});
