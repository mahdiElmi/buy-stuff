import { prisma } from "@/lib/db";
import EditProductForm from "./EditProductForm";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { useDropzone } from "@uploadthing/react";

export default async function Page({
  params,
}: {
  params: { productId: string };
}) {
  const session = await auth();
  const user =
    session && session.user && session.user.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
        })
      : null;
  if (!user) redirect("/sign-in");

  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: { vendor: true, images: true, categories: true },
  });

  if (user.id !== product?.vendor.userId) redirect("/");

  const categories = await prisma.category.findMany({
    where: { name: { in: ["Clothes", "Electronics"] } },
  });

  return <EditProductForm categories={categories} product={product} />;
}
