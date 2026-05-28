import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import HomePageCarousel from "@/components/HomePageCarousel";
import { title } from "radashi";

export default async function HomePage() {
  const [newArrivalProducts, discountedProducts, allCategories] =
    await prisma.$transaction([
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
        orderBy: { name: "asc" }, // or any order you like
      }),
    ]);

  // Fetch a sample product with an image for each chosen category
  const categoriesWithImages = await Promise.all(
    allCategories.map(async (category) => {
      const product = await prisma.product.findFirst({
        where: {
          categories: { some: { id: category.id } },
          images: { some: {} }, // at least one image
        },
        include: { images: { take: 1 } },
      });
      return {
        ...category,
        imageUrl: product?.images[0]?.url ?? "/placeholder.jpg", // fallback
      };
    }),
  );

  return (
    <section className="flex size-full min-w-0 flex-col items-center justify-center gap-5 px-1 py-10">
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

      <section className="h-fit w-full space-y-5 rounded-md bg-zinc-200 px-2 py-5 sm:px-5 dark:bg-zinc-900">
        <h2 className="text-3xl font-extrabold capitalize md:text-4xl">
          Shop By Category
        </h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
          {categoriesWithImages.map((cat) => (
            <Link
              key={cat.id}
              className="relative overflow-hidden rounded-md bg-zinc-500/5 hover:bg-zinc-500/10"
              href={`/products/${cat.name}`}
            >
              <Image
                className="aspect-square rounded-lg object-cover object-center"
                width={400}
                height={400}
                alt={title(cat.name)}
                src={cat.imageUrl}
              />
              <span className="bg-muted/50 absolute bottom-0 left-0 w-fit rounded-md px-1 py-0.5 text-center font-semibold backdrop-blur-sm sm:text-sm md:text-2xl">
                {title(cat.name)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
