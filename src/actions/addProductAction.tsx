"use server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs";
const productSchema = z.object({
  name: z
    .string()
    .trim()
    .max(100, { message: "must be fewer than 100 characters long" }),
  description: z.string().max(1000),
  categories: z.string().optional(),
  price: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().min(0).finite()),
  quantity: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().min(1).finite()),
});
export async function addProduct(formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be signed in to add a product");
  }
  const parsedFormData = productSchema.parse(
    Object.fromEntries(formData.entries()),
  );

  console.log("🐸🐸🐸");
  console.log(parsedFormData);
  // prisma.product.create({
  //   data: {
  //     name: parsedFormData.name,
  //     description: parsedFormData.description,
  //     price: parsedFormData.price,
  //     stock: parsedFormData.quantity,

  //   },
  // });
}
