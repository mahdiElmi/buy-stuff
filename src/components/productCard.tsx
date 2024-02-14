import { ProductWithImagesAndVendor } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductCard({
  product,
}: {
  product: ProductWithImagesAndVendor;
}) {
  return (
    <div
      key={product.id}
      className={cn(
        "flex flex-col overflow-hidden rounded-md p-1",
        product.stock <= 0 && "opacity-70",
      )}
    >
      <Link href={`/product/${product.id}`} className="group relative min-w-0">
        {product.images[0] && product.images[0].url && (
          <Image
            width={400}
            height={400}
            className="aspect-square rounded-sm object-cover"
            src={product.images[0].url}
            alt="product Image"
          />
        )}
        <span
          className="absolute bottom-0 left-0 rounded-tr-md bg-zinc-50/50 p-1 text-2xl font-extrabold backdrop-blur-sm 
        transition-opacity duration-100 group-hover:opacity-50 dark:bg-zinc-900"
        >
          {product.price}
          <span className="text-base">$</span>
        </span>
        {product.stock < 5 && (
          <span
            className="absolute bottom-0 right-0 min-w-fit rounded-tl-md bg-zinc-50/50 p-1 text-lg font-semibold backdrop-blur-sm 
          transition-opacity duration-100 group-hover:opacity-50 dark:bg-zinc-900"
          >
            {product.stock > 0 ? (
              <span>{product.stock} left!</span>
            ) : (
              <span className="text-base">Out Of Stock!</span>
            )}
          </span>
        )}
      </Link>
      <div className="flex h-full flex-col justify-between px-1 pt-2">
        <Link
          href={`/product/${product.id}`}
          className=" decoration-2 underline-offset-2 hover:text-blue-600 hover:underline dark:hover:text-blue-400"
        >
          <h2 className="text-lg/5 font-bold">{product.name}</h2>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            className="me-1 text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 "
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
        <p className="mb-1 mt-2 line-clamp-2 font-medium text-zinc-700 dark:text-zinc-300">
          {product.description}, Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. A eveniet veniam sunt et atque maiores esse facere
          doloribus, quas nesciunt eius, aliquam deleniti ipsam ad repudiandae
          provident totam ab! Non!
        </p>
      </div>
    </div>
  );
}
