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

async function Navbar({ theme }: { theme: string }) {
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
    <nav className="sticky top-0 z-50 bg-zinc-50 bg-opacity-50 px-3 backdrop-blur-lg dark:bg-zinc-950 xl:px-0 ">
      <div className="mx-auto flex max-w-[95rem] flex-row items-center gap-5  border-zinc-200 py-1 dark:border-zinc-800 ">
        <Link
          href="/"
          className="h-min w-min break-words rounded-sm p-[1px] text-3xl font-black leading-none opacity-85 transition-transform "
        >
          BUY STUFF
        </Link>
        <Link
          href="/products"
          className=" h-min w-min rounded-sm p-[1px] text-2xl font-medium capitalize leading-none opacity-85 transition-transform 
          hover:opacity-100"
        >
          products
        </Link>
        <Link
          href="/about"
          className=" h-min w-min rounded-sm p-[1px] text-2xl font-medium capitalize leading-none opacity-85 transition-transform 
          hover:opacity-100"
        >
          about
        </Link>
        <Link
          href="/blog"
          className="h-min w-min rounded-sm p-[1px] text-2xl font-medium capitalize leading-none opacity-85 transition-transform 
          hover:opacity-100"
        >
          blog
        </Link>
        <SearchBar />
        <div className="ms-auto flex items-center gap-5">
          <ThemeToggle theme={theme} />
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
