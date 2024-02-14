"use server";
import { prisma } from "@/lib/db";
import { vendorSchema } from "@/lib/zodSchemas";
import { Vendor } from "@prisma/client";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
type VendorFields = z.infer<typeof vendorSchema>;

export async function RegisterAction(values: VendorFields) {
  const validationResult = vendorSchema.safeParse(values);
  if (validationResult.success) {
    const isVendorNameAvailable = await prisma.vendor.findUnique({
      where: { name: values.name },
    });
    if (!Boolean(isVendorNameAvailable)) {
      const session = await auth();
      if (session && session.user && session.user.email) {
        const newVendor = await prisma.vendor.create({
          data: {
            name: values.name,
            description: values.description,
            user: { connect: { email: session.user.email } },
          },
        });
        redirect(`/vendors/${newVendor.id}`);
        return {
          success: true,
        };
      }
    } else {
      return {
        success: false,
        cause: "invalidUser",
      };
    }
  } else {
    return {
      success: false,
      cause: "validationError",
      error: validationResult.error,
    };
  }
  console.log("yoooooooo", values);
}
