import type { Product } from "@prisma/client";
import Image from "next/image";

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div
      key={product.id}
      className="flex flex-col overflow-hidden rounded-md bg-neutral-800 p-5"
    >
      {product.imageURL && (
        <Image
          className="aspect-square"
          src={product.imageURL}
          alt="product Image"
        />
      )}
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold text-neutral-50">{product.name}</h2>
        <span>{product.stock} in stock</span>
      </div>
      <p className="font-medium text-neutral-300">{product.description}</p>
      <span>{product.price}$</span>
    </div>
  );
}
