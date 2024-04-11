import { FilteredAndSortedProductList } from "@/components/ProductGrid";
import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await auth();
  const user =
    session && session.user && session.user.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            favorites: {
              include: {
                _count: { select: { reviews: true } },
                images: true,
                vendor: true,
              },
            },
          },
        })
      : null;
  if (!user) redirect("/sign-in");

  return (
    <div className="mb-5 flex w-full flex-col gap-10 px-5 md:ps-0">
      <h1 className="me-auto self-start text-4xl font-black">Favorites</h1>
      <FilteredAndSortedProductList products={user.favorites} />
    </div>
  );
}

export default page;
