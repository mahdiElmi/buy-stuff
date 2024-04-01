"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import { utapi } from "@/server/uploadthing";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

// await utapi.deleteFiles("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
// await utapi.deleteFiles([
//   "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg",
//   "1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg",
// ]);

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session || !session.user)
    return { success: false, cause: "User is not authenticated." };

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: { select: { url: true } },
      vendor: { include: { user: { select: { email: true } } } },
    },
  });
  if (!product) return { success: true, cause: "Product doesn't exist" };
  if (product.vendor.user.email !== session.user.email)
    return { success: false, cause: "User does not own this product." };

  try {
    const [
      imagesDeleteResult,
      voteDeleteResult,
      reviewsDeleteResult,
      productDeleteResult,
    ] = await prisma.$transaction([
      prisma.image.deleteMany({ where: { productId } }),
      prisma.vote.deleteMany({ where: { review: { productId } } }),
      prisma.review.deleteMany({ where: { productId } }),
      prisma.product.delete({ where: { id: productId } }),
    ]);

    const imageKeys = product.images.map(
      (imgObj) => imgObj.url.split("/f/")[1],
    );

    const result = await utapi.deleteFiles(imageKeys);
    revalidatePath("/dashboard/vendor-products");
    revalidatePath(`/product/${productId}`);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function deleteProductInBulk(productIds: string[]) {
  const session = await auth();
  if (!session || !session.user)
    return { success: false, cause: "User is not authenticated." };

  const products = await prisma.$transaction(
    productIds.map((productId) =>
      prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: { select: { url: true } },
          vendor: { include: { user: { select: { email: true } } } },
        },
      }),
    ),
  );
  if (products.length < 1)
    return { success: true, cause: "There are no products." };
  for (let product of products) {
    if (!product) return { success: true, cause: "Product doesn't exist" };
    if (product.vendor.user.email !== session.user.email)
      return { success: false, cause: "User does not own this product." };
  }

  try {
    const allDeleteQueries = productIds
      .map((productId) => [
        prisma.image.deleteMany({ where: { productId } }),
        prisma.review.deleteMany({ where: { productId } }),
        prisma.product.delete({ where: { id: productId } }),
      ])
      .flat();

    const results = await prisma.$transaction(allDeleteQueries);
    // const [imagesDeleteResult, reviewsDeleteResult, productDeleteResult] =
    //   await prisma.$transaction([
    //     prisma.image.deleteMany({ where: { productId } }),
    //     prisma.review.deleteMany({ where: { productId } }),
    //     prisma.product.delete({ where: { id: productId } }),
    //   ]);

    const imageKeys: string[] = [];
    for (let product of products) {
      for (let image of product!.images) {
        imageKeys.push(image.url.split("/f/")[1]);
      }
    }

    const result = await utapi.deleteFiles(imageKeys);
    revalidatePath("/dashboard/vendor-products");
    return { success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { success: false, cause: e.message };
    }
    return { success: false };
  }
}
