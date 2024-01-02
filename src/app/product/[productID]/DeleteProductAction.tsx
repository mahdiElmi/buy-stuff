"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function deleteProduct(id: string) {
  const thingsToDelete = [];
  thingsToDelete.push(
    prisma.review.deleteMany({
      where: {
        productId: id,
      },
    }),
  );
  thingsToDelete.push(
    prisma.image.deleteMany({
      where: {
        productId: id,
      },
    }),
  );
  thingsToDelete.push(
    prisma.product.delete({
      where: {
        id,
      },
    }),
  );
  try {
    await prisma.$transaction(thingsToDelete);
    redirect("/");
  } catch {
    return false;
  }
}
