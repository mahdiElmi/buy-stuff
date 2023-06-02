import Header from "../components/Header";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Buy Stuff",
  description:
    "you can buy Stuff here or sell em YOU choose we give the power to YOU",
  icons: { icon: "./favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="flex min-h-screen flex-col bg-neutral-900 text-neutral-50">
          <Header />
          <main className="mx-auto h-full max-w-[90rem] sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="mt-auto border-t border-neutral-700/50 bg-neutral-950 py-10">
            <div className="mx-auto flex h-full max-w-[90rem] items-center justify-center sm:px-6 lg:px-8">
              © 2023 Buy Stuff Inc. All rights reserved.
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
