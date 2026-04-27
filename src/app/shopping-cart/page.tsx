import {
  LocalShoppingCartItems,
  ShoppingCartItemWithProduct,
  UserWithShoppingCart,
} from "@/lib/types";
import BigCart from "./BigCart";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
};

async function shoppingCart() {
  const session = await auth();
  let shoppingCartItems: ShoppingCartItemWithProduct[] = [];
  if (session && session.user) {
    shoppingCartItems = await prisma.shoppingCartItem.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        product: {
          select: {
            id: true,
            price: true,
            name: true,
            stock: true,
            discountPercentage: true,
            originalPrice: true,
            images: {
              select: { url: true },
              take: 1,
            },
          },
        },
        quantity: true,
        productId: true,
      },
    });

    // for (let item of user.shoppingCartItems) {
    //   const { productId, quantity, product } = item;
    //   shoppingCartItems[productId] = {
    //     productId,
    //     quantity,
    //     name: product.name,
    //     image: product.images[0].url,
    //     price: product.price,
    //     stock: product.stock,
    //   };
    // }
  }
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Shopping Cart
      </h1>
      <BigCart
        cartItemsFromServer={shoppingCartItems}
        userId={session && session.user ? session.user.id : null}
      />
    </div>
  );
}

export default shoppingCart;
