"use client";
import { productSchema } from "@/lib/zodSchemas";
import Image from "next/image";
import { z } from "zod";
// import { ProductData } from "./page";
type ProductData = z.infer<typeof productSchema>;
export default function DummyProductItem({
  product,
}: {
  product: ProductData;
}) {
  return (
    <div className="w-full max-w-sm place-self-center @container/1">
      <h2 className="py-2 text-2xl font-bold">Product Card Preview</h2>
      <div
        className="flex w-full flex-col overflow-hidden rounded-md border-zinc-300 bg-gradient-to-t from-zinc-300 from-20% to-white shadow-md 
          drop-shadow-sm transition-transform duration-75 @5xl/1:p-6 dark:border-zinc-700 dark:from-zinc-700 dark:to-zinc-950"
      >
        {product.imgUrls.length > 0 ? (
          <Image
            width={400}
            height={400}
            className="aspect-square rounded-sm object-cover"
            src={product.imgUrls[0]}
            alt="product Image"
          />
        ) : (
          <div className="aspect-square bg-gradient-to-tr from-zinc-400/50 to-zinc-600/50"></div>
        )}
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between">
            {product.name !== "" ? (
              <h2 className="w-96 break-words text-lg font-bold">
                {product.name}
              </h2>
            ) : (
              <div className="h-6 w-64 rounded-md bg-gradient-to-tr from-zinc-400 to-zinc-600"></div>
            )}
          </div>
          {product.description !== "" ? (
            <p className="line-clamp-3 w-full break-words font-medium text-zinc-700 dark:text-zinc-300">
              {product.description}
            </p>
          ) : (
            <div className="space-y-2">
              <div className="h-4 w-80 rounded-md bg-zinc-500/50"></div>
              <div className="h-4 w-96 rounded-md bg-zinc-500/50"></div>
              <div className="h-4 w-60 rounded-md bg-zinc-500/50"></div>
            </div>
          )}
          <div className="flex justify-between">
            {product.price === 0 ? (
              <span className="text-lg font-medium">Free</span>
            ) : (
              <span className="text-xl font-extrabold tracking-tighter">
                {product.price}
                <span className="text-xs ">$</span>
              </span>
            )}
            <span className="text-lg font-medium">
              <span className="font-semibold">{product.stock}</span> in stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
