import Navbar from "../components/Navbar";
import NextAuthProvider from "./NextAuthProvider";
import "./globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import SessionProvider from "../components/SessionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  // display: "swap",
});

export const metadata = {
  title: "Buy Stuff",
  description:
    "you can buy Stuff here or sell em YOU choose we give the power to YOU",
  icons: { icon: "./favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = cookies().get("theme")?.value ?? "";
  const session = await getServerSession();
  return (
    <NextAuthProvider>
      <html lang="en" className={`${inter.variable} ${theme}`}>
        <body className="scroll flex min-h-screen flex-col bg-zinc-50 bg-scroll text-zinc-950 scrollbar-thin dark:bg-zinc-950 dark:text-zinc-50">
          <SessionProvider session={session}>
            <Navbar theme={theme} />
            <main className="flex h-full flex-grow items-center justify-center scrollbar sm:px-6 lg:px-8">
              {children}
            </main>
            <footer className="mt-auto w-full max-w-[95rem] self-center border-t border-zinc-200 py-4 dark:border-zinc-800">
              <div className="mx-auto flex h-full w-full items-center justify-center sm:px-6 lg:px-8">
                © 2023 Buy Stuff Inc. All rights reserved.
              </div>
            </footer>
          </SessionProvider>
        </body>
      </html>
    </NextAuthProvider>
  );
}
