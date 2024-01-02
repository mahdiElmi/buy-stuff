import { ProductWithImages } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
export default function ProductItem({
  product,
}: {
  product: ProductWithImages;
}) {
  return (
    <div className="h-full w-full rounded-md border-2 border-transparent @container/1 ">
      <Link href={`/product/${product.id}`}>
        <div
          key={product.id}
          className="flex h-full w-fit flex-col overflow-hidden rounded-md border-zinc-300 
          bg-gradient-to-t from-zinc-300 from-20% to-white p-1 shadow-md 
          drop-shadow-sm transition-transform duration-75 @5xl/1:p-6 
          hover:from-zinc-200 dark:border-zinc-700 dark:from-zinc-700 dark:to-zinc-950 dark:hover:from-zinc-600"
        >
          {product.images[0] && product.images[0].url && (
            <Image
              width={400}
              height={400}
              className="aspect-square rounded-sm object-cover"
              src={product.images[0].url}
              alt="product Image"
            />
          )}
          <div className="flex h-full flex-col justify-between pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{product.name}</h2>
            </div>
            <p className="line-clamp-3 font-medium text-zinc-700 dark:text-zinc-300">
              {product.description}, Lorem, ipsum dolor sit amet consectetur
              adipisicing elit. A eveniet veniam sunt et atque maiores esse
              facere doloribus, quas nesciunt eius, aliquam deleniti ipsam ad
              repudiandae provident totam ab! Non!
            </p>
            <div className="flex items-center justify-between">
              {product.price === 0 ? (
                <span className="text-lg font-medium">Free</span>
              ) : (
                <span className="text-xl font-extrabold tracking-tighter">
                  {product.price}
                  <span className="text-xs font-medium"> $</span>
                </span>
              )}
              {product.stock < 5 && (
                <span className="min-w-fit text-base font-bold text-zinc-300 dark:text-zinc-200">
                  Only <span>{product.stock}</span> left in stock!
                </span>
              )}
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
      </Link>
    </div>
  );
}
