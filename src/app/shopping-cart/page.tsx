import { LocalShoppingCartItems, UserWithShoppingCart } from "@/lib/types";
import BigCart from "./BigCart";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";

async function shoppingCart() {
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
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Shopping Cart
      </h1>
      <BigCart
        cartItemsFromServer={shoppingCartItems}
        userId={user ? user.id : null}
      />
    </div>
  );
}

export default shoppingCart;
