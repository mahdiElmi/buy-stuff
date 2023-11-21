import ProductGrid from "@/components/ProductGrid";
import ProductItem from "@/components/productItem";
import { prisma } from "@/lib/db";
import Image from "next/image";
import React from "react";

async function Product({ params }: { params: { vendorID: string } }) {
  console.log(params);
  const { vendorID } = params;

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: vendorID,
    },
  });
  const vendorProducts = await prisma.product.findMany({
    where: {
      vendorId: vendor?.id,
    },
  });
  return (
    <div className="w-full max-w-6xl self-start">
      <div className="relative mb-10 w-full before:absolute before:h-full before:w-full before:bg-gradient-to-t before:from-black/70 before:from-5% before:to-transparent before:content-['']">
        <div className="absolute bottom-0 left-0 flex items-center gap-2 px-2 py-2">
          <Image
            className="rounded-md border"
            src={
              vendor?.imageURL ??
              "https://uploadthing.com/f/cfb6a331-a29c-43b8-ac91-897528dd01cc_download.jpg"
            }
            alt=""
            width={65}
            height={65}
          />
          <h1 className="text-4xl font-bold capitalize text-white ">
            {vendor?.name}
          </h1>
        </div>
        <Image
          className="h-52 w-full rounded-lg object-cover "
          src={
            vendor?.imageURL ??
            "https://uploadthing.com/f/cfb6a331-a29c-43b8-ac91-897528dd01cc_download.jpg"
          }
          alt=""
          width={900}
          height={200}
        />
      </div>
      <p>{vendor?.description}</p>
      <h2 className="text-2xl font-bold">Our Products</h2>
      <ProductGrid products={vendorProducts} />
    </div>
  );
}

export default Product;
