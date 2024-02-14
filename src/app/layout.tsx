import Navbar from "../components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { auth } from "@/server/auth";
import SessionProvider from "../components/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  // display: "swap",
});

export const metadata: Metadata = {
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
  const session = await auth();
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="flex min-h-[100dvh] flex-col bg-zinc-50 bg-scroll text-zinc-950 scrollbar-thin dark:bg-zinc-950 dark:text-zinc-50">
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <JotaiProvider>
              <Navbar />
              <main className="flex h-full flex-grow items-center justify-center scrollbar sm:px-6 lg:px-8">
                {children}
              </main>
            </JotaiProvider>
          </ThemeProvider>
        </SessionProvider>
        <footer className="mt-auto w-full max-w-8xl self-center border-t border-zinc-200 py-4 dark:border-zinc-800">
          <div className="mx-auto flex h-full w-full items-center justify-center sm:px-6 lg:px-8">
            © 2024 Buy Stuff Inc. All rights reserved.
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
