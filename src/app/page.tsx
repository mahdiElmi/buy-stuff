import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import HomePageCarousel from "@/components/HomePageCarousel";

export default async function HomePage() {
  const [
    newArrivalProducts,
    discountedProducts,
    [clotheCategory, electronicsCategory],
  ] = await prisma.$transaction([
    prisma.product.findMany({
      where: { stock: { not: 0 } },
      include: {
        images: true,
        vendor: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),

    prisma.product.findMany({
      where: { stock: { not: 0 } },
      include: {
        images: true,
        vendor: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { discountPercentage: "desc" },
      take: 10,
    }),

    prisma.category.findMany({
      where: { name: { in: ["Clothes", "Electronics"] } },
    }),
  ]);

  return (
    <section className="flex h-full w-full min-w-0 flex-col items-center justify-center gap-5 px-1 py-10">
      <h1 className="sr-only">Home Page</h1>
      <HomePageCarousel
        headerLink="/products"
        products={newArrivalProducts}
        headerText="new arrivals"
      />
      <HomePageCarousel
        headerLink="/products?discounted=true"
        products={discountedProducts}
        headerText="Deals"
      />
      <section className="h-fit w-full space-y-5 rounded-md bg-zinc-200 px-2 py-5 dark:bg-zinc-900 sm:px-5">
        <h2 className="text-3xl font-extrabold capitalize md:text-4xl">
          Shop By Category
        </h2>
        <div className="flex gap-5">
          <Link
            className="relative overflow-hidden"
            href={`/products/${clotheCategory.name}`}
          >
            <Image
              className="aspect-square rounded-lg object-cover object-center"
              width={400}
              height={400}
              alt="clothes"
              src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <span className="absolute bottom-0 left-0 mx-2 my-1 w-fit text-2xl font-semibold text-emerald-100">
              {clotheCategory.name}
            </span>
          </Link>
          <Link
            className="relative overflow-hidden"
            href={`/products/${electronicsCategory.name}`}
          >
            <Image
              className="aspect-square rounded-lg object-cover object-center"
              width={400}
              height={400}
              alt="Electronics"
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <span className="absolute bottom-0 left-0 mx-2 my-1 w-fit text-2xl font-bold text-slate-950">
              {electronicsCategory.name}
            </span>
          </Link>
        </div>
      </section>
    </section>
  );
}
