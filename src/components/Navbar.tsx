import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import UserProfileButton from "./UserProfileButton";
import SearchBar from "./SearchBar";
import ShoppingCart from "./ShoppingCart";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashNav from "./DashNav";
import SignInButton from "./SignInButton";
import NavMenu from "./navMenu";

async function Navbar() {
  const session = await auth();

  // Fetch categories for both desktop and mobile menus
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const user =
    session && session.user && session.user.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            shoppingCartItems: {
              select: {
                product: {
                  select: {
                    id: true,
                    price: true,
                    name: true,
                    stock: true,
                    discountPercentage: true,
                    originalPrice: true,
                    images: { select: { url: true }, take: 1 },
                  },
                },
                quantity: true,
                productId: true,
              },
            },
            vendor: { select: { id: true } },
          },
        })
      : null;

  return (
    <header
      id="navbar"
      className="sticky top-0 z-50 w-full min-w-fit gap-2 bg-zinc-50 px-3 py-1 dark:bg-zinc-950"
    >
      <nav className="max-w-8xl mx-auto flex flex-row items-center gap-5 py-1">
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="size-6" />
            <span className="sr-only">Open navigation menu</span>
          </SheetTrigger>
          <SheetContent
            className="flex w-[280px] flex-col overflow-y-auto border-zinc-200 pe-6 dark:border-zinc-700"
            side="left"
          >
            {user && <DashNav user={user} />}

            <div className="flex flex-col items-start gap-1 pt-5">
              <Button
                asChild
                className="w-full justify-start text-start text-xl font-bold"
                variant="ghost"
              >
                <Link href="/products">All Products</Link>
              </Button>

              <div className="mt-3 mb-1 px-4 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Categories
              </div>

              {/* Scrollable Categories List for Mobile */}
              <div className="flex max-h-[45vh] w-full scrollbar-thin scrollbar-thumb-zinc-300 flex-col gap-0.5 overflow-y-auto pe-2 dark:scrollbar-thumb-zinc-700">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    asChild
                    className="w-full justify-start text-start text-base font-medium capitalize"
                    variant="ghost"
                  >
                    <Link
                      href={`/products/${encodeURIComponent(category.name)}`}
                    >
                      {category.name}
                    </Link>
                  </Button>
                ))}
              </div>

              <div className="my-3 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

              <Button
                asChild
                className="w-full justify-start text-start text-xl font-bold"
                variant="ghost"
              >
                <Link href="/about">About</Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start text-start text-xl font-bold"
                variant="ghost"
              >
                <Link href="/blog">Blog</Link>
              </Button>
            </div>

            <ThemeToggle className="absolute right-5 bottom-5" />
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="me-auto flex size-min flex-col text-lg leading-none font-black select-none md:me-0"
        >
          <span className="h-min leading-none">BUY!!!</span>
          <span className="-mt-1 h-min leading-none">STUFF</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-4">
          <NavMenu categories={categories} />
        </div>

        <SearchBar className="" />

        <div className="ms-auto flex items-center gap-2 md:gap-5">
          <ThemeToggle className="hidden md:flex" />
          <ShoppingCart
            cartItemsFromServer={user ? user.shoppingCartItems : []}
            userId={user && user.id}
          />
          {user ? <UserProfileButton user={user} /> : <SignInButton />}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
