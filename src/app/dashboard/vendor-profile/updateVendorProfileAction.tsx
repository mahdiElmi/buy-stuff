"use server";

import { prisma } from "@/lib/db";
import { checkAuth } from "@/lib/utils";
import { vendorSchema } from "@/lib/zodSchemas";
import { z } from "zod";

export default async function updateVendorProfile(
  values: z.infer<typeof vendorSchema>,
  userId: string,
) {
  const authResult = await checkAuth(userId);
  const { success: areValuesValid } = vendorSchema.safeParse(values);

  if (!areValuesValid) return { success: false, cause: "Validation error" };
  if (!authResult.success) return authResult;
  try {
    await prisma.vendor.update({
      where: { userId: userId },
      data: {
        name: values.name,
        description: values.description,
        imageURL: values.image,
        bannerImage: values.bannerImage,
      },
    });
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error" };
  }
}
