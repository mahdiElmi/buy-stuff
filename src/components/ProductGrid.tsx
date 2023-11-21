"use server";
import { prisma } from "@/lib/db";
import ProductItem from "@/components/productItem";
import { Product } from "@prisma/client";

// async function getProducts() {
//   const products = await prisma.product.findMany({
//     take: 20,
//   });
//   return products;
// }

export default async function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  // const allProducts = await getProducts();
  // const productElements = allProducts.map((product) => {
  //   return <ProductItem product={product} key={product.id} />;
  // });
  const productElements = products.map((product) => {
    return <ProductItem product={product} key={product.id} />;
  });
  return (
    <div className="h-full w-full @container">
      <div className="grid h-full w-full grid-cols-2 gap-4 rounded-md py-5 @2xl:grid-cols-3 @5xl:grid-cols-4 @6xl:grid-cols-5 @7xl:grid-cols-6">
        {productElements}
      </div>
    </div>
  );
}
