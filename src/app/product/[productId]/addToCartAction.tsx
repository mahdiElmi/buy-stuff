"use server";

import { prisma } from "@/lib/db";
import { checkAuth } from "@/lib/utils";

export default async function addToCart(
  userId: string,
  quantity: number,
  productId: string,
) {
  const { success, cause } = await checkAuth(userId);
  if (!success) return { success, cause };

  const productToAdd = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!productToAdd) return { success: false, cause: "product doesn't exist." };

  const productAlreadyInCart = await prisma.shoppingCartItem.findUnique({
    where: { productId_userId: { userId, productId } },
    select: { quantity: true },
  });
  const isProductAlreadyInCart = productAlreadyInCart !== null;
  if (
    productToAdd.stock <
    (isProductAlreadyInCart ? productAlreadyInCart.quantity : 0) + quantity
  )
    return { success: false, cause: "Quantity is more than stock available." };

  try {
    if (isProductAlreadyInCart) {
      await prisma.shoppingCartItem.update({
        where: { productId_userId: { userId, productId } },
        data: {
          quantity: { increment: quantity },
        },
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          shoppingCartItems: {
            create: {
              quantity,
              productId,
            },
          },
        },
      });
    }
  } catch {
    return { success: false, cause: "Database error." };
  }
  return { success: true, cause: "" };
}
