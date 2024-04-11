import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import UserProfileButton from "./UserProfileButton";
import SearchBar from "./SearchBar";
import ShoppingCart from "./ShoppingCart";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";
import { LocalShoppingCartItems } from "@/lib/types";
import { Button } from "./ui/button";
import { Dot, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashNav from "./DashNav";
import SignInButton from "./SignInButton";
import NavMenu from "./navMenu";

async function Navbar() {
  const session = await auth();
  const user =
    session && session.user && session.user.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            shoppingCartItems: {
              include: { product: { include: { images: true } } },
            },
            vendor: true,
          },
        })
      : null;

  const shoppingCartItems: LocalShoppingCartItems = {};
  if (user) {
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

  return (
    <header
      id="navbar"
      className="sticky top-0 z-50 w-full min-w-fit gap-2 bg-zinc-50 px-3 py-1 dark:bg-zinc-950"
    >
      <nav className="mx-auto flex max-w-[95rem] flex-row items-center gap-5 py-1">
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open navigation menu</span>
          </SheetTrigger>
          <SheetContent
            className="w-fit border-zinc-200 pe-10 dark:border-zinc-700"
            side="left"
          >
            <>
              {user && <DashNav user={user} />}
              <div className="flex flex-col items-start gap-3 pt-5">
                <Button
                  asChild
                  className="text-start text-xl font-bold"
                  variant="ghost"
                >
                  <Link href="/products?page=1" className="">
                    Products
                  </Link>
                </Button>
                <Button
                  asChild
                  className="ms-1 text-start text-xl font-bold"
                  variant="ghost"
                >
                  <Link href="/products/clothes" className="">
                    <Dot className="h-9 w-9  " /> Clothes
                  </Link>
                </Button>
                <Button
                  asChild
                  className="ms-1 text-start text-xl font-bold"
                  variant="ghost"
                >
                  <Link href="/products/electronics" className="">
                    <Dot className="h-9 w-9  " /> Electronics
                  </Link>
                </Button>
                <Button
                  asChild
                  className="text-start text-xl font-bold"
                  variant="ghost"
                >
                  <Link href="/about" className="">
                    About
                  </Link>
                </Button>
                <Button
                  asChild
                  className="text-start text-xl font-bold"
                  variant="ghost"
                >
                  <Link href="/blog" className="">
                    Blog
                  </Link>
                </Button>
              </div>
              <ThemeToggle className="absolute bottom-5 right-5 " />
            </>
          </SheetContent>
        </Sheet>
        <Link
          href="/"
          className="me-auto flex h-min w-min select-none flex-col text-lg font-black leading-none md:me-0 "
        >
          <span className="h-min leading-none">BUY!!!</span>
          <span className="-mt-1 h-min leading-none">STUFF</span>
        </Link>
        <div className="hidden md:flex md:items-center md:gap-4">
          <NavMenu />
        </div>
        <SearchBar className="" />
        <div className="ms-auto flex items-center gap-2 md:gap-5">
          <ThemeToggle className="hidden md:flex" />
          <ShoppingCart
            cartItemsFromServer={shoppingCartItems}
            userId={user && user.id}
          />
          {user ? <UserProfileButton user={user} /> : <SignInButton />}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
