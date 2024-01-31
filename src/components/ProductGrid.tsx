import ProductItem from "@/components/productItem";
import { ProductWithImages } from "@/lib/types";

export default async function ProductGrid({
  products,
}: {
  products: (ProductWithImages & { _averageRating?: number })[];
}) {
  if (products.length <= 0)
    return (
      <div className="flex h-[70dvh] flex-col items-center justify-center">
        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          No Products Found!
        </h1>
        <p className="text-3xl font-bold text-zinc-700 dark:text-zinc-400 md:text-4xl">
          check out our other stuff maybe?
        </p>
      </div>
    );

  const productElements = products.map((product) => {
    return <ProductItem product={product} key={product.id} />;
  });
  return (
    <div className="h-full w-full @container">
      <div className="grid h-full w-full grid-cols-2 gap-4 rounded-md @2xl:grid-cols-3 @5xl:grid-cols-4 @6xl:grid-cols-5 @7xl:grid-cols-6">
        {productElements}
      </div>
    </div>
  );
}
