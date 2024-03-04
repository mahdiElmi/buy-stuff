import { ProductWithImagesAndVendor } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
// import AddFavoriteButton from "../app/product/[productId]/AddFavoriteButton";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";

export default async function ProductCard({
  product,
}: {
  product: ProductWithImagesAndVendor;
}) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      reviewVotes: true,
      favorites: {
        where: { id: product.id },
        select: { id: true },
      },
    },
  });
  const hasUserAddedToFavorites = !!user?.favorites[0];

  return (
    <div className="h-full @container/card">
      <div
        key={product.id}
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md p-1",
          product.stock <= 0 && "opacity-70",
        )}
      >
        <Link
          href={`/product/${product.id}`}
          className="group relative min-w-0"
        >
          <Image
            width={400}
            height={400}
            className="aspect-square rounded-sm object-cover"
            src={
              product.images[0] && product.images[0].url
                ? product.images[0].url
                : "/questionMark.png"
            }
            alt="product Image"
          />
          <span
            className="absolute -left-[1px] bottom-0 rounded-tr-md bg-zinc-200 p-1 text-xs  font-extrabold transition-opacity 
        duration-100 group-hover:opacity-50 @[8rem]/card:text-2xl dark:bg-zinc-900"
          >
            <span className="text-xs @[8rem]/card:text-base">$</span>
            {formatPrice(product.price)}
          </span>
          {/* <AddFavoriteButton
            className="absolute right-[2px] top-[2px] z-10"
            productId={product.id}
            favoriteInitialState={hasUserAddedToFavorites}
            variant="ghostHoverLess"
          /> */}
          {product.stock < 5 && (
            <span
              className="absolute -right-[1px] bottom-0 min-w-fit rounded-tl-md bg-zinc-200 px-1 text-base font-semibold  transition-opacity duration-100 
          group-hover:opacity-50 dark:bg-zinc-900"
            >
              {product.stock > 0 ? (
                <span>Only {product.stock} left!</span>
              ) : (
                <span>Out Of Stock!</span>
              )}
            </span>
          )}
        </Link>
        <div className="flex h-full flex-col justify-between px-1 pt-2">
          <Link
            href={`/product/${product.id}`}
            className=" decoration-2 underline-offset-2 hover:text-blue-600 hover:underline dark:hover:text-blue-400"
          >
            <h2 className="text-xs font-bold @[8rem]/card:text-lg/5 @md/card:text-xl/6 ">
              {product.name}
            </h2>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              className="me-1 text-xs font-medium text-zinc-600 @[8rem]/card:text-sm hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 "
              href={`/vendors/${product.vendorId}`}
            >
              {product.vendor.name}
            </Link>
            {product._count.reviews > 0 && (
              <>
                <Star className="ms-auto h-4 w-4 fill-current " />
                <span className="min-w-fit text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {product.averageRating.toFixed(
                    product.averageRating % 1 === 0 ? 0 : 1,
                  )}
                </span>
              </>
            )}
          </div>
          <p className="mb-1 mt-2 line-clamp-2 text-xs font-medium text-zinc-700 @[8rem]/card:text-sm dark:text-zinc-300">
            {product.description}, Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. A eveniet veniam sunt et atque maiores esse facere
            doloribus, quas nesciunt eius, aliquam deleniti ipsam ad repudiandae
            provident totam ab! Non!
          </p>
        </div>
      </div>
    </div>
  );
}
