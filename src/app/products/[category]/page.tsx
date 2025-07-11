import ProductGrid from "@/components/ProductGrid";
import { ParamsType } from "@/lib/types";
import { Metadata } from "next";
export async function generateMetadata(
  props: {
    params: Promise<{ category: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return {
    title: params.category,
  };
}
export default async function Page(
  props: {
    searchParams: Promise<ParamsType>;
    params: Promise<{ vendorId: string | undefined; category: string | undefined }>;
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  return <ProductGrid params={params} searchParams={searchParams} />;
}
