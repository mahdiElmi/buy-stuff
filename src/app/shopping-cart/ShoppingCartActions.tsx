"use server";

import { prisma } from "@/lib/db";
import { LocalShoppingCartItem, LocalShoppingCartItems } from "@/lib/types";
import { auth } from "@/server/auth";
import { revalidatePath } from "next/cache";

export default async function addToCart(quantity: number, productId: string) {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, cause: "User not logged in." };
  }
  const userId = session.user.id!;

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
  revalidatePath("/");
  return { success: true, cause: "" };
}

export async function updateShoppingCartItemQuantity(
  productId: string,
  isPositive: boolean,
) {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, cause: "User not logged in." };
  }
  const userId = session.user.id!;

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

    revalidatePath("/");
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error." };
  }
}

export async function deleteItemFromCart(productId: string) {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, cause: "User not logged in." };
  }
  const userId = session.user.id!;

  try {
    await prisma.shoppingCartItem.delete({
      where: { productId_userId: { productId, userId } },
    });

    revalidatePath("/");
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error." };
  }
}

export async function clearCart() {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, cause: "User not logged in." };
  }
  const userId = session.user.id!;

  try {
    await prisma.shoppingCartItem.deleteMany({
      where: { userId: userId },
    });

    revalidatePath("/");
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error." };
  }
}

export async function updateCart(cart: LocalShoppingCartItems) {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, cause: "User not logged in." };
  }
  const userId = session.user.id!;

  try {
    await prisma.shoppingCartItem.deleteMany({
      where: { userId: userId },
    });

    revalidatePath("/");
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error." };
  }
}
export async function syncCart(cart: LocalShoppingCartItem[]) {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, cause: "User not logged in." };
  }
  const userId = session.user.id!;

  try {
    await prisma.shoppingCartItem.createMany({
      data: cart.map((item) => ({
        quantity: item.quantity,
        productId: item.productId,
        userId,
      })),
    });

    revalidatePath("/");
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error." };
  }
}
