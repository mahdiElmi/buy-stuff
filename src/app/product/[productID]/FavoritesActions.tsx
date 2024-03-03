"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";

export async function addToFavorites(productId: string) {
  "use server";
  const session = await auth();
  if (!session || !session.user || !session.user.email)
    return { success: false, cause: "User is not authenticated." };
  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        favorites: { connect: { id: productId } },
      },
    });
  } catch (error) {
    return { success: false, cause: "database error" };
  }

  return { success: true, cause: "" };
}

export async function removeFromFavorites(productId: string) {
  "use server";
  const session = await auth();

  if (!session || !session.user || !session.user.email)
    return { success: false, cause: "User is not authenticated." };
  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        favorites: { disconnect: { id: productId } },
      },
    });
  } catch (error) {
    return { success: false, cause: "database error" };
  }

  return { success: true, cause: "" };
}
