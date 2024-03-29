import Navbar from "../components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { auth } from "@/server/auth";
import SessionProvider from "../components/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" className={`${inter.variable} scroll-smooth font-sans`}>
      <body
        className="flex min-h-[100dvh] flex-col bg-zinc-50 text-zinc-950 scrollbar scrollbar-thumb-zinc-400/40
        hover:scrollbar-thumb-zinc-400 active:scrollbar-thumb-zinc-500 dark:bg-zinc-950 dark:text-zinc-50 dark:scrollbar-thumb-zinc-800/40
        dark:hover:scrollbar-thumb-zinc-800 dark:active:scrollbar-thumb-zinc-700"
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <JotaiProvider>
              <Navbar />
              <main className="flex h-full flex-grow items-center justify-center sm:px-6 lg:px-8">
                {children}
              </main>
            </JotaiProvider>
          </ThemeProvider>
        </SessionProvider>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
