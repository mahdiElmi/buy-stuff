import ProductGrid from "@/components/ProductGrid";
import { ParamsType } from "@/lib/types";

export default async function Products({
  searchParams,
  params,
}: {
  searchParams: ParamsType;
  params: { vendorId: string | undefined };
}) {
  return <ProductGrid params={params} searchParams={searchParams} />;
}
