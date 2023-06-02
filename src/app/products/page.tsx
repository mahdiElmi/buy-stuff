import { prisma } from "@/db";
import Link from "next/link";
import ProductItem from "@/components/productItem";

export default async function Products() {
  const allProducts = await prisma.product.findMany();
  const productElements = allProducts.map((product) => {
    return <ProductItem product={product} key={product.id} />;
  });
  return (
    <div>
      <Link
        className="rounded-lg border-2 border-white p-1"
        href="/products/add"
      >
        Add Product
      </Link>
      <h1 className="text-3xl font-bold">you can buy these</h1>
      <div className="grid grid-cols-2 gap-5">{productElements}</div>
    </div>
  );
}
