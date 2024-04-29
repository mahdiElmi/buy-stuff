"use server";

import { prisma } from "@/lib/db";
import { checkAuth } from "@/lib/utils";
import { profileSchema, shippingAddressSchema } from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProfile(
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

export async function updateShippingAddress(
  values: z.infer<typeof shippingAddressSchema>,
  userId: string,
) {
  const authResult = await checkAuth(userId);
  if (!authResult.success) return authResult;

  const { success: areValuesValid } = shippingAddressSchema.safeParse(values);
  if (!areValuesValid) return { success: false, cause: "Validation error" };

  try {
    await prisma.shippingAddress.update({
      where: { id: values.id },
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        country: values.country,
        state: values.state,
        city: values.city,
        address: values.address,
        zip: values.zip,
        phoneNumber: values.phoneNumber,
      },
    });
    revalidatePath("/dashboard");

    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error" };
  }
}

export async function addShippingAddress(
  values: z.infer<typeof shippingAddressSchema>,
  userId: string,
) {
  const authResult = await checkAuth(userId);
  if (!authResult.success) return authResult;

  const { success: areValuesValid } = shippingAddressSchema.safeParse(values);
  if (!areValuesValid) return { success: false, cause: "Validation error" };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { _count: { select: { shippingAddresses: true } } },
  });
  if (!user) return { success: false, cause: "User not found" };
  if (user._count.shippingAddresses >= 3)
    return { success: false, cause: "Maximum address limit reached. (3)" };

  try {
    // await prisma.$transaction(async (tx) => {
    //   const result = await prisma.shippingAddress.create({
    //     data: {
    //       firstName: values.firstName,
    //       lastName: values.lastName,
    //       country: values.country,
    //       state: values.state,
    //       city: values.city,
    //       address: values.address,
    //       zip: values.zip,
    //       phoneNumber: values.phoneNumber,
    //       User: { connect: { id: userId } },
    //     },
    //     select: { id: true },
    //   });
    //   await prisma.user.update({
    //     where: { id: userId },
    //     data: { defaultShippingAddress: { connect: { id: result.id } } },
    //   });
    // });
    await prisma.shippingAddress.create({
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        country: values.country,
        state: values.state,
        city: values.city,
        address: values.address,
        zip: values.zip,
        isDefault:
          user._count.shippingAddresses === 0
            ? { connect: { id: userId } }
            : undefined,
        phoneNumber: values.phoneNumber,
        User: { connect: { id: userId } },
      },
    });
    revalidatePath("/dashboard");

    return { success: true, cause: "" };
  } catch (error) {
    console.error(error);

    return { success: false, cause: "Database error" };
  }
}

export async function deleteShippingAddress(userId: string, addressId: string) {
  const authResult = await checkAuth(userId);
  if (!authResult.success) return authResult;

  try {
    await prisma.shippingAddress.delete({
      where: { id: addressId },
    });
    revalidatePath("/dashboard");
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error" };
  }
}
export async function changeDefaultAddress(userId: string, addressId: string) {
  const authResult = await checkAuth(userId);
  if (!authResult.success) return authResult;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        defaultShippingAddress: { connect: { id: addressId } },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, cause: "" };
  } catch (error) {
    return { success: false, cause: "Database error" };
  }
}
