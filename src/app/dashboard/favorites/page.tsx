import { FilteredAndSortedProductList } from "@/components/ProductGrid";
import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      favorites: {
        include: {
          _count: { select: { reviews: true } },
          images: true,
          vendor: true,
        },
      },
    },
  });
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col gap-10">
      <h1 className="me-auto self-start text-4xl font-black">Favorites</h1>
      <FilteredAndSortedProductList products={user.favorites} />
    </div>
  );
}

export default page;
