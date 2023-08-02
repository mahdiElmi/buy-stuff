import { prisma } from "@/lib/db";
import React from "react";

async function Product({ params }: { params: { productID: string } }) {
  console.log(params);
  const { productID } = params;
  const product = await prisma.product.findUnique({
    where: {
      id: productID,
    },
  });
  return <div>{product?.name}</div>;
}

export default Product;
