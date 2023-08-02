import type { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="w-full @container/1">
      <Link href={`/product/${product.id}`}>
        <div
          key={product.id}
          className="flex w-fit flex-col overflow-hidden rounded-md border-zinc-300 bg-gradient-to-t from-zinc-300 from-20% to-white shadow-md 
          drop-shadow-sm transition-transform duration-75 @5xl/1:p-6 dark:border-zinc-700 dark:from-zinc-700 dark:to-zinc-950"
        >
          {product.imageURL && (
            <Image
              width={400}
              height={400}
              className="aspect-square rounded-sm object-cover"
              src={product.imageURL}
              alt="product Image"
            />
          )}
          <div className="flex flex-col p-2">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">{product.name}</h2>
              <span>{product.stock} in stock</span>
            </div>
            <p className="line-clamp-3 font-medium text-zinc-700 dark:text-zinc-300">
              {product.description}, Lorem, ipsum dolor sit amet consectetur
              adipisicing elit. A eveniet veniam sunt et atque maiores esse
              facere doloribus, quas nesciunt eius, aliquam deleniti ipsam ad
              repudiandae provident totam ab! Non!
            </p>
            <div className="flex justify-between">
              <span className="my-1 font-medium">{product.price}$</span>
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
