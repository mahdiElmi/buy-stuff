// Add this directive at the top to enforce that this module
// is only ever used on the server.
import "server-only";

import { auth } from "@/server/auth";
import { prisma } from "./db";

// checks whether current user is logged in and whether they are the same as the one who sent the request.
export async function checkAuth(userId: string) {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, cause: "User is not authenticated." };
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, cause: "User doesn't exist." };
  }
  if (user.email !== session.user.email) {
    return {
      success: false,
      cause: "User who made the request isn't the same as the user logged in.",
    };
  }
  return { success: true, cause: "" };
}

// You can add any other server-specific utility functions here in the future.
