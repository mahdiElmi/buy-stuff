import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import UserProfileButton from "./UserProfileButton";
import SearchBar from "./SearchBar";
import ShoppingCart from "./ShoppingCart";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";
import { LocalShoppingCartItems, UserWithShoppingCart } from "@/lib/types";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

async function Navbar() {
  const session = await auth();
  let user: UserWithShoppingCart | null = null;
  const shoppingCartItems: LocalShoppingCartItems = {};
  if (session && session.user && session.user.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        shoppingCartItems: {
          include: { product: { include: { images: true } } },
        },
      },
    });
    if (user) {
      //   shoppingCartItems = user.shoppingCartItems.map(
      //     ({ productId, quantity, product }) => ({
      //       productId,
      //       quantity,
      //       name: product.name,
      //       image: product.images[0].url,
      //     }),
      //   );
      for (let item of user.shoppingCartItems) {
        const { productId, quantity, product } = item;
        shoppingCartItems[productId] = {
          productId,
          quantity,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          stock: product.stock,
        };
      }
    }
  }

  return (
    <nav
      id="navbar"
      className="sticky top-0 z-50 w-full min-w-fit gap-2 bg-zinc-50 px-3 dark:bg-zinc-950"
    >
      <div className="mx-auto flex max-w-[95rem] flex-row items-center gap-5 py-1">
        <Sheet>
          <SheetTrigger className="md:hidden">
            {/* <Button className="h-9 w-9 p-1" variant="outline" size="icon"> */}
            <Menu className="h-6 w-6" />
            {/* </Button> */}
          </SheetTrigger>
          <SheetContent
            className="w-fit border-zinc-200 pe-10 dark:border-zinc-700"
            side="left"
          >
            <div className="flex flex-col items-start gap-3 pt-5">
              <Link
                href="/products?page=1"
                className="h-min w-min text-2xl font-medium capitalize leading-none text-zinc-800 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                products
              </Link>
              <Link
                href="/about"
                className="h-min w-min text-2xl font-medium capitalize leading-none text-zinc-800 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                about
              </Link>
              <Link
                href="/blog"
                className="h-min w-min text-2xl font-medium capitalize leading-none text-zinc-800 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                blog
              </Link>
            </div>
            <ThemeToggle className="mt-5 border border-zinc-300 dark:border-zinc-700" />
          </SheetContent>
        </Sheet>
        <Link
          href="/"
          className="me-auto flex h-min w-min select-none flex-col text-lg font-black leading-none sm:text-2xl md:me-0 md:text-2xl"
        >
          <span className="h-min leading-none">BUY!!!</span>
          <span className="-mt-1 h-min leading-none">STUFF</span>
        </Link>
        <div className="hidden md:flex md:items-center md:gap-4">
          <Link
            href="/products?page=1"
            className="h-min w-min text-2xl font-medium capitalize leading-none text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            products
          </Link>
          <Link
            href="/about"
            className="h-min w-min text-2xl font-medium capitalize leading-none text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            about
          </Link>
          <Link
            href="/blog"
            className="h-min w-min text-2xl font-medium capitalize leading-none text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            blog
          </Link>
        </div>
        {/* <SearchBar className="hidden md:block" /> */}
        <SearchBar className="" />
        <div className="ms-auto flex items-center gap-2 md:gap-5">
          <ThemeToggle className="hidden md:flex" />
          <ShoppingCart cartItemsFromServer={shoppingCartItems} />
          {user ? (
            <UserProfileButton user={user} />
          ) : (
            <Button asChild variant="outline">
              <Link
                href="/sign-in"
                className="h-min w-max rounded-xl text-xl font-medium leading-none text-zinc-950 dark:text-zinc-50 
              dark:hover:text-white  "
              >
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
      {/* <SearchBar className="md:hidden" /> */}
    </nav>
  );
}

export default Navbar;
