"use server";
import { prisma } from "@/lib/db";

export default async function deleteReview(id: string) {
  const stuffToDelete = [];
  stuffToDelete.push(prisma.review.delete({ where: { id } }));
  stuffToDelete.push(prisma.vote.deleteMany({ where: { reviewId: id } }));
  try {
    await prisma.$transaction(stuffToDelete);
    return true;
  } catch {
    return false;
  }
}
