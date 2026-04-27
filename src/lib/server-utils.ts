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

export type Serialized<T> =
  // Dates become strings
  T extends Date
    ? string
    : // BigInts become strings
      T extends bigint
      ? string
      : // Arrays get mapped element‑wise
        T extends Array<infer U>
        ? Serialized<U>[]
        : // Objects get mapped property‑wise
          T extends object
          ? { [K in keyof T]: Serialized<T[K]> }
          : // Everything else stays the same
            T;

export function serialize<T>(obj: T): Serialized<T> {
  const cloned = JSON.parse(JSON.stringify(obj));
  return cloned as any; // we use `any` here because TS can’t verify the runtime transform
}
