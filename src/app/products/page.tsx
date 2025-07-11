import ProductGrid from "@/components/ProductGrid";
import { ParamsType } from "@/lib/types";

export default async function Products(
  props: {
    searchParams: Promise<ParamsType>;
    params: Promise<{ vendorId: string | undefined }>;
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  return <ProductGrid params={params} searchParams={searchParams} />;
}
