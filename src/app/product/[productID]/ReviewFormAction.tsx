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
      select: { vendor: true },
    });
    if (product?.vendor.id === userId)
      return { success: false, cause: "Reviewer is vendor" };
    try {
      await prisma.review.create({
        data: {
          rating: values.rating,
          title: values.title,
          body: values.body,
          reviewedBy: { connect: { id: userId } },
          reviewed: { connect: { id: productId } },
        },
      });
      // prisma.$queryRaw``
    } catch {
      return { success: false, cause: "database" };
    }
  } else return { success: false, cause: "Validation error" };

  revalidatePath("/product/[productID]");

  return { success: true, cause: "" };
}
