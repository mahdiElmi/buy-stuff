"use server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/zodSchemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import { Image } from "@prisma/client";
type ProductFields = z.infer<typeof productSchema>;

export async function addProduct(values: ProductFields) {
  const validationResult = productSchema.safeParse(values);

  if (validationResult.success) {
    const session = await getServerSession(authOptions);
    if (session && session.user && session.user.email) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        include: {
          vendor: true,
        },
      });
      const urls = values.imgUrls.map((imgUrl) => ({
        url: imgUrl,
      }));
      if (user && user.vendor) {
        const newProduct = await prisma.product.create({
          data: {
            name: values.name,
            description: values.description,
            price: values.price,
            stock: values.stock,
            images: {
              createMany: {
                data: urls,
              },
            },
            vendor: {
              connect: {
                id: user.vendor.id,
              },
            },
          },
        });
        redirect(`/product/${newProduct.id}`);
      } else {
        return {
          success: false,
          cause: "notVendor",
        };
      }
    }
  } else {
    return {
      success: false,
      error: validationResult.error,
      cause: "validation",
    };
  }
}
