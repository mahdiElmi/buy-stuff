import { LocalShoppingCartItems, UserWithShoppingCart } from "@/lib/types";
import BigCart from "./BigCart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/lib/db";

async function shoppingCart() {
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
    <BigCart
      cartItemsFromServer={shoppingCartItems}
      userId={user ? user.id : null}
    />
  );
}

export default shoppingCart;
