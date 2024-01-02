"use server";
import { prisma } from "@/lib/db";

export default async function deleteReview(id: string) {
  try {
    await prisma.review.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
