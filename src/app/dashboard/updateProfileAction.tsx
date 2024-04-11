"use server";

import { prisma } from "@/lib/db";
import { checkAuth } from "@/lib/utils";
import { profileSchema } from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export default async function updateProfile(
  values: z.infer<typeof profileSchema>,
  userId: string,
) {
  const authResult = await checkAuth(userId);
  const { success: areValuesValid } = profileSchema.safeParse(values);

  if (!areValuesValid) return { success: false, cause: "Validation error" };
  if (!authResult.success) return authResult;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        image: values.image,
      },
    });
    revalidatePath("/dashboard");

    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error" };
  }
}
