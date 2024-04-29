"use server";

import { prisma } from "@/lib/db";
import { LocalShoppingCartItems } from "@/lib/types";
import { checkAuth } from "@/lib/utils";

export async function updateShoppingCartItemQuantity(
  userId: string,
  productId: string,
  isPositive: boolean,
) {
  const { success, cause } = await checkAuth(userId);
  if (!success) return { success, cause };

  const productToBeUpdated = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!productToBeUpdated)
    return { success: false, cause: "product doesn't exist." };

  const productAlreadyInCart = await prisma.shoppingCartItem.findUnique({
    where: { productId_userId: { userId, productId } },
    select: { quantity: true },
  });
  if (!productAlreadyInCart)
    return { success: false, cause: "Product is not in cart." };
  if (
    isPositive &&
    productToBeUpdated.stock < productAlreadyInCart.quantity + 1
  )
    return { success: false, cause: "Quantity is more than stock available." };
  try {
    if (!isPositive && 0 > productAlreadyInCart.quantity - 1) {
      await prisma.shoppingCartItem.delete({
        where: { productId_userId: { productId, userId } },
      });
    } else {
      await prisma.shoppingCartItem.update({
        where: { productId_userId: { productId, userId } },
        data: { quantity: isPositive ? { increment: 1 } : { decrement: 1 } },
      });
    }
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error." };
  }
}

export async function deleteItemFromCart(userId: string, productId: string) {
  const { success, cause } = await checkAuth(userId);
  if (!success) return { success, cause };

  try {
    await prisma.shoppingCartItem.delete({
      where: { productId_userId: { productId, userId } },
    });
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error." };
  }
}

export async function clearCart(userId: string) {
  const { success, cause } = await checkAuth(userId);
  if (!success) return { success, cause };

  try {
    await prisma.shoppingCartItem.deleteMany({
      where: { userId: userId },
    });
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error." };
  }
}

export async function updateCart(userId: string, cart: LocalShoppingCartItems) {
  const { success, cause } = await checkAuth(userId);
  if (!success) return { success, cause };

  try {
    await prisma.shoppingCartItem.deleteMany({
      where: { userId: userId },
    });
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error." };
  }
}
