import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function Product({ params }: { params: { productID: string } }) {
  console.log(params);
  const { productID } = params;
  const product = await prisma.product.findUnique({
    where: {
      id: productID,
    },
  });
  const vendor = await prisma.vendor.findUnique({
    where: {
      id: product?.vendorId,
    },
  });

  return (
    <div>
      <h1 className="text-4xl font-bold capitalize ">{product?.name}</h1>
      {product?.imageURL && (
        <Image
          src={product?.imageURL}
          alt=""
          width={400}
          height={400}
          className="text-2xl font-bold"
        />
      )}
      <div>
        {vendor?.imageURL && (
          <Image
            className="rounded-full"
            src={vendor?.imageURL}
            alt=""
            width={70}
            height={70}
          />
        )}
        <Link
          href={`/vendors/${product?.vendorId}`}
          className="text-lg font-semibold text-violet-700 hover:underline hover:decoration-2"
        >
          {vendor?.name}
        </Link>
      </div>
      <p>{product?.description}</p>
    </div>
  );
}

export default Product;
