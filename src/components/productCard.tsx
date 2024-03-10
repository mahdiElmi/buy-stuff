import { ProductWithImagesAndVendor } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { auth } from "@/server/auth";
import { prisma } from "@/lib/db";
import AddFavoriteButton from "./AddFavoriteButton";

export default async function ProductCard({
  product,
}: {
  product: ProductWithImagesAndVendor;
}) {
  const session = await auth();
  const user =
    session && session.user && session.user.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            reviewVotes: true,
            favorites: {
              where: { id: product.id },
              select: { id: true },
            },
          },
        })
      : null;
  // console.log("orig babe", product.originalPrice, product);
  const hasUserAddedToFavorites = !!user?.favorites[0];

  return (
    <div className="h-full @container/card">
      <div
        key={product.id}
        className={cn(
          "relative flex h-full w-full flex-col overflow-hidden rounded-md p-1",
          product.stock <= 0 && "opacity-70",
        )}
      >
        {user && (
          <AddFavoriteButton
            className="absolute right-[2px] top-[2px] z-10 text-white drop-shadow-sm "
            productId={product.id}
            favoriteInitialState={hasUserAddedToFavorites}
            variant="ghostHoverLess"
          />
        )}
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
          <div className="absolute -left-[1px] bottom-0 ">
            <div
              className="relative z-20 h-full w-full rounded-tr-md bg-zinc-200 px-2 py-[2px] transition-opacity duration-100 
        first-letter:font-light group-hover:opacity-50 dark:bg-zinc-900"
            >
              <span className="text-xs font-extrabold  @[8rem]/card:text-xl">
                {formatPrice(product.price)}
              </span>

              {product.discountPercentage > 0 && (
                <div
                  className="absolute left-0 top-0 z-30 flex -translate-y-full  items-center justify-center rounded-r-md transition-opacity duration-100  
                    group-hover:opacity-50  "
                >
                  <span className="h-full rounded-tr-md bg-zinc-200 p-[3px] px-[4px] text-xs line-through decoration-black first-letter:font-light dark:bg-zinc-700  dark:decoration-white">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span
                    className="flex -translate-x-[2px] translate-y-1 items-center justify-center rounded-md bg-red-200 p-[1px] px-[3px] text-xs font-medium transition-opacity duration-100 
                    group-hover:opacity-50 @[8rem]/card:text-sm dark:bg-red-900"
                  >
                    {product.discountPercentage}%
                  </span>
                </div>
              )}
            </div>
          </div>
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
