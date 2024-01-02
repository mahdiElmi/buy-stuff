"use server";

import { z } from "zod";
import { ReviewSchema } from "@/lib/zodSchemas";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
type ReviewFields = z.infer<typeof ReviewSchema>;
export default async function SubmitReview(
  values: ReviewFields,
  userId: string,
  productId: string,
) {
  const validationResult = ReviewSchema.safeParse(values);
  if (validationResult.success) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendor: true },
    });
    if (product?.vendor.id === userId)
      return { success: false, cause: "Reviewer is vendor" };
    // #TODO   does it even throw?
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
