import { ProductWithImagesAndVendor } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import CustomRating from "./ui/CustomRating";
import { Star } from "lucide-react";
export default function ProductItem({
  product,
}: {
  product: ProductWithImagesAndVendor & { _averageRating?: number };
}) {
  return (
    <div className="h-full w-full rounded-md border-2 border-transparent @container/1 ">
      <div
        key={product.id}
        className="flex h-full w-fit flex-col overflow-hidden rounded-md border-zinc-300 bg-zinc-300 from-20% p-1 shadow-md 
          drop-shadow-sm transition-transform duration-75 @5xl/1:p-6 
          dark:border-zinc-700 dark:bg-zinc-700"
      >
        <Link href={`/product/${product.id}`} className="group relative">
          {product.images[0] && product.images[0].url && (
            <Image
              width={400}
              height={400}
              className="aspect-square rounded-sm object-cover"
              src={product.images[0].url}
              alt="product Image"
            />
          )}
          <span className="absolute bottom-0 left-0 rounded-tr-md bg-zinc-50 bg-opacity-50 p-1 text-2xl font-extrabold drop-shadow-md transition-opacity duration-100 group-hover:opacity-50 dark:bg-zinc-900">
            {product.price}
            <span className="text-base">$</span>
          </span>
          {product.stock < 5 && (
            <span className="absolute bottom-0 right-0 min-w-fit rounded-tl-md bg-zinc-50 bg-opacity-50 p-1 text-lg font-semibold drop-shadow-md transition-opacity duration-100 group-hover:opacity-50 dark:bg-zinc-900">
              <span>{product.stock}</span> left!
            </span>
          )}
        </Link>
        <div className="flex h-full flex-col justify-between px-1 pt-2">
          <div className="flex items-center justify-between">
            <Link
              href={`/product/${product.id}`}
              className="decoration-2 underline-offset-2 hover:text-blue-600 hover:underline dark:hover:text-blue-400"
            >
              <h2 className="text-lg font-bold">{product.name}</h2>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Link
              className="me-1 text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 "
              href={`/vendors/${product.vendorId}`}
            >
              {product.vendor.name}
            </Link>
            {product._averageRating && (
              <>
                {/* <CustomRating
                  className="h-5 max-w-24"
                  readOnly
                  color="gold"
                  value={product._averageRating}
                /> */}
                <Star className="ms-auto h-5 w-5 fill-current " />
                <span className="min-w-fit text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {product._averageRating.toFixed(
                    product._averageRating % 1 === 0 ? 0 : 1,
                  )}
                </span>
              </>
            )}
          </div>
          <p className="mb-1 mt-2 line-clamp-3 font-medium text-zinc-700 dark:text-zinc-300">
            {product.description}, Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. A eveniet veniam sunt et atque maiores esse facere
            doloribus, quas nesciunt eius, aliquam deleniti ipsam ad repudiandae
            provident totam ab! Non!
          </p>
          <div className="flex items-center justify-between">
            {/* {product.price === 0 ? (
              <span className="text-lg font-medium">Free</span>
            ) : (
              <span className="text-lg font-semibold tracking-tighter">
                {product.price}
                <span className="text-xs font-medium"> $</span>
              </span>
            )}
            {product.stock < 5 && (
              <span className="min-w-fit text-base font-bold text-zinc-600 dark:text-zinc-200">
                <span>{product.stock}</span> left!
              </span>
            )} */}

            {/* <span className="my-1 font-medium">{product.price}$</span> */}
            {/* <Link
                href={`/product/${product.id}`}
                className="w-fit rounded-md bg-zinc-200 p-1 dark:bg-zinc-700 "
              >
                Show More
              </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
