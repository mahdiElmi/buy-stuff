import ProductGrid from "@/components/ProductGrid";
import ProductItem from "@/components/productItem";
import { prisma } from "@/lib/db";
import Image from "next/image";

async function VendorPage({ params }: { params: { vendorID: string } }) {
  console.log(params);
  const { vendorID } = params;

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: vendorID,
    },
    include: { products: { include: { images: true } } },
  });
  if (!vendor) {
    return <div>Vendor Not Found!</div>;
  }

  return (
    <div className="w-full max-w-7xl self-start py-5">
      <div className="relative w-full shadow-sm before:absolute before:h-full before:w-full before:bg-gradient-to-t before:from-black/70 before:from-5% before:to-transparent before:content-['']">
        <div className="absolute bottom-0 left-0 flex items-center gap-2 p-3">
          <Image
            className="rounded-md border"
            src={
              vendor.imageURL ??
              "https://uploadthing.com/f/cfb6a331-a29c-43b8-ac91-897528dd01cc_download.jpg"
            }
            alt=""
            width={65}
            height={65}
          />
          <h1 className="text-4xl font-bold capitalize text-white ">
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
      <p className="bg-zinc-800 px-3 py-4 text-lg text-zinc-100 shadow-sm">
        {vendor.description}
      </p>
      <div className="rounded-b-lg bg-zinc-900 px-3 py-5">
        <h2 className="text-center text-3xl font-extrabold lg:text-start">
          Our Products
        </h2>
        <ProductGrid products={vendor.products} />
      </div>
    </div>
  );
}

export default VendorPage;
