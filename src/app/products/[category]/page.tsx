import ProductGrid from "@/components/ProductGrid";
import { ParamsType } from "@/lib/types";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: ParamsType;
  params: { vendorId: string | undefined; category: string | undefined };
}) {
  return <ProductGrid params={params} searchParams={searchParams} />;
}
