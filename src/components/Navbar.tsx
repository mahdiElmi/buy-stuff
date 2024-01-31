import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import UserProfileButton from "./UserProfileButton";
import SearchBar from "./SearchBar";
import ShoppingCart from "./ShoppingCart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/lib/db";
import {
  LocalShoppingCartItem,
  LocalShoppingCartItems,
  UserWithShoppingCart,
} from "@/lib/types";

async function Navbar() {
  const session = await getServerSession(authOptions);
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
    <nav className="sticky top-0 z-50 bg-zinc-50 bg-opacity-50 px-3 backdrop-blur-lg dark:bg-zinc-950">
      <div className="mx-auto flex max-w-[95rem] flex-row items-center gap-5 py-1">
        <Link
          href="/"
          className="flex h-min w-min flex-col text-2xl font-black leading-none sm:text-2xl "
        >
          <span className="h-min leading-none">BUY!!!</span>
          <span className="-mt-1 h-min leading-none">STUFF</span>
        </Link>
        <div className="lg:gp-5 hidden md:flex md:items-center md:gap-3">
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
        <SearchBar />
        <div className="ms-auto flex items-center gap-2 md:gap-5">
          <ThemeToggle />
          <ShoppingCart cartItemsFromServer={shoppingCartItems} />
          {user ? (
            <UserProfileButton user={user} />
          ) : (
            <Link
              href="/sign-in"
              className="h-min w-max rounded-xl p-2 text-2xl font-medium leading-none 
              text-zinc-950 dark:text-zinc-50 dark:hover:text-white "
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
