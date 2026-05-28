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
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Buy Stuff",
    default: "Buy Stuff",
  },
  description:
    "Welcome to Buy Stuff, the ultimate online marketplace where you can buy and sell a wide range of products. Discover new items, connect with buyers and sellers, and enjoy secure transactions. Start shopping or selling today!",
  keywords: [
    "E-commerce",
    "Online marketplace",
    "Shopping platform",
    "Online shopping",
    "Marketplace",
    "Online store",
    "Shopping website",
    "Retail marketplace",
    "Buy online",
    "Sell online",
    "Shopping community",
    "Online trading",
    "Retail platform",
    "Goods exchange",
    "Product marketplace",
    "Virtual marketplace",
  ],
  icons: { icon: "./favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${inter.variable} scroll-smooth font-sans`}
    >
      <body className="scrollbar flex min-h-dvh scrollbar-thumb-zinc-400/40 flex-col bg-zinc-50 text-zinc-950 hover:scrollbar-thumb-zinc-400 active:scrollbar-thumb-zinc-500 dark:scrollbar-thumb-zinc-800/40 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:scrollbar-thumb-zinc-800 dark:active:scrollbar-thumb-zinc-700">
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <JotaiProvider>
              <Navbar />
              <div className="bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white">
                This is a portfolio demonstration project. Please do not enter
                real payment information.
              </div>
              <main className="flex h-full grow items-center justify-center sm:px-6 lg:px-8">
                <TooltipProvider>{children}</TooltipProvider>
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
