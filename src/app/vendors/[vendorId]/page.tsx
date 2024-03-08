import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/db";
import { ParamsType } from "@/lib/types";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

async function VendorPage({
  searchParams,
  params,
}: {
  searchParams: ParamsType;
  params: { vendorId: string };
}) {
  // console.log(searchParams, params);
  const { vendorId } = params;
  if (!vendorId) return;
  const vendor = await prisma.vendor.findUnique({
    where: {
      id: vendorId,
    },
    // include: {
    //   products: {
    //     include: {
    //       images: true,
    //       vendor: { select: { name: true } },
    //       _count: { select: { reviews: true } },
    //     },
    //   },
    // },
  });
  if (!vendor) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-yellow-600 p-5 text-8xl font-semibold tracking-tighter">
        <AlertTriangle className="h-36 w-36 text-yellow-600" />
        Vendor Not Found!
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl self-start py-5">
      <div className="relative w-full shadow-sm">
        <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-md bg-zinc-100 pe-2 shadow-xl dark:bg-zinc-950">
          <Image
            className="rounded-lg border-4 border-zinc-100 dark:border-zinc-950 "
            src={
              vendor.imageURL ??
              "https://uploadthing.com/f/cfb6a331-a29c-43b8-ac91-897528dd01cc_download.jpg"
            }
            alt=""
            width={75}
            height={75}
          />
          <h1 className="text-4xl font-black capitalize tracking-tight text-black dark:text-white ">
            {vendor.name}
          </h1>
        </div>
        <Image
          className="h-52 w-full rounded-t-lg object-cover "
          src={
            vendor.imageURL ??
            "https://uploadthing.com/f/cfb6a331-a29c-43b8-ac91-897528dd01cc_download.jpg"
          }
          alt=""
          width={900}
          height={200}
        />
      </div>
      <p className="rounded-b-md bg-zinc-200 px-3 py-4 text-lg font-medium shadow-sm dark:bg-zinc-800">
        {vendor.description}
      </p>
      <div className="rounded-b-lg bg-zinc-200 py-5 dark:bg-zinc-950">
        <h2 className="px-3 text-center text-3xl font-extrabold lg:text-start">
          Our Products
        </h2>
        <ProductGrid
          searchParams={searchParams}
          params={params}
          className="px-2"
        />
      </div>
    </div>
  );
}

export default VendorPage;
