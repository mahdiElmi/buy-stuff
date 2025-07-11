import { prisma } from "@/lib/db";
import AddProductForm from "./AddProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product",
};

export default async function Page() {
  const categories = await prisma.category.findMany({
    where: { name: { in: ["Clothes", "Electronics"] } },
  });

  return <AddProductForm categories={categories} />;
}
