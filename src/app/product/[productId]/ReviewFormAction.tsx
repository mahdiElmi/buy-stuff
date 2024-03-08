"use server";

import { z } from "zod";
import { ReviewSchema } from "@/lib/zodSchemas";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/utils";
type ReviewFields = z.infer<typeof ReviewSchema>;
export default async function SubmitReview(
  values: ReviewFields,
  userId: string,
  productId: string,
) {
  const result = await checkAuth(userId);
  // #TODO: rewrite this if result returning user is useful
  if (!result.success) return result;

  const validationResult = ReviewSchema.safeParse(values);
  if (validationResult.success) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { _count: { select: { reviews: true } }, vendor: true },
      // select: {
      //   vendor: true,
      //   averageRating: true,
      //   _count: { select: { reviews: true } },
      // },
    });
    if (!product) return { success: false, cause: "ProcutId is not valid." };
    if (product.vendor.userId === userId)
      return { success: false, cause: "Reviewer is vendor" };
    try {
      const reviewCreationToFlush = prisma.review.create({
        data: {
          rating: values.rating,
          title: values.title,
          body: values.body,
          reviewedBy: { connect: { id: userId } },
          reviewed: { connect: { id: productId } },
        },
      });
      // trying not to divide by zero
      const newAverageRating =
        (product.averageRating + values.rating) / product._count.reviews === 0
          ? 1
          : product._count.reviews;
      const productUpdateToFlush = prisma.product.update({
        where: { id: productId },
        data: {
          averageRating: newAverageRating,
        },
      });
      await prisma.$transaction([reviewCreationToFlush, productUpdateToFlush]);
    } catch {
      return { success: false, cause: "database" };
    }
  } else return { success: false, cause: "Validation error" };

  revalidatePath("/product/[productID]");

  return { success: true, cause: "" };
}
