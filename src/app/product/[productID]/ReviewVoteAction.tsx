"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function Vote(
  isVoteUp: boolean,
  reviewId: string,
  userId: string,
) {
  try {
    const vote = await prisma.vote.findUnique({
      where: { userId_reviewId: { reviewId, userId } },
    });
    if (vote && vote.isVoteUp === isVoteUp)
      return {
        success: false,
        cause: `User has already voted ${isVoteUp ? "up" : "down"}.`,
      };

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        upvoteCount: isVoteUp ? { increment: vote?2:1 } : { decrement: vote?2:1 },
        Vote: {
          upsert: {
            where: {
              userId_reviewId: {
                userId,
                reviewId,
              },
            },
            update: {
              isVoteUp,
            },
            create: {
              isVoteUp,
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      },
    });
    // revalidatePath("/product/[productID]");
    return {
      success: true,
    };
  } catch (e) {
    console.log("-----------------", e);
    return {
      success: false,
      cause: "Review with the provided ID doesn't exist.",
    };
  }
}
