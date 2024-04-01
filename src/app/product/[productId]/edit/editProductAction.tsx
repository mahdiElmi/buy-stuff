"use server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/zodSchemas";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
type ProductFields = z.infer<typeof productSchema>;

export async function editProduct(
  values: ProductFields,
  productId: string,
  productVendorId: string,
) {
  const validationResult = productSchema.safeParse(values);

  if (validationResult.success) {
    const session = await auth();
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
        if (user.vendor.id !== productVendorId)
          return {
            success: false,
            cause: "User is not the original vendor",
          };

        const [deleteResult, newProduct] = await prisma.$transaction([
          prisma.image.deleteMany({ where: { productId: productId } }),
          prisma.product.update({
            where: {
              id: productId,
            },
            data: {
              name: values.name,
              description: values.description,
              price: values.price,
              stock: values.stock,
              categories: { connect: { name: values.categories } },
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
          }),
        ]);

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
