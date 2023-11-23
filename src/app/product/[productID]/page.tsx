import { prisma } from "@/lib/db";
// import Link from "next/link";
// import React from "react";

// async function Product({ params }: { params: { productID: string } }) {
//   console.log(params);
//   const { productID } = params;
//   const product = await prisma.product.findUnique({
//     where: {
//       id: productID,
//     },
//   });
//   const vendor = await prisma.vendor.findUnique({
//     where: {
//       id: product?.vendorId,
//     },
//   });

//   return (
//     <div>
//       <h1 className="text-4xl font-bold capitalize ">{product?.name}</h1>
//       {product?.imageURL && (
//         <Image
//           src={product?.imageURL}
//           alt=""
//           width={400}
//           height={400}
//           className="text-2xl font-bold"
//         />
//       )}
//       <div>
//         {vendor?.imageURL && (
//           <Image
//             className="rounded-full"
//             src={vendor?.imageURL}
//             alt=""
//             width={70}
//             height={70}
//           />
//         )}
//         <Link
//           href={`/vendors/${product?.vendorId}`}
//           className="text-lg font-semibold text-violet-700 hover:underline hover:decoration-2"
//         >
//           {vendor?.name}
//         </Link>
//       </div>
//       <p>{product?.description}</p>
//     </div>
//   );
// }

// export default Product;

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import { Disclosure, RadioGroup, Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import ImageGroup from "./ImageGroup";

// const product = {
//   name: "Zip Tote Basket",
//   price: "$140",
//   rating: 4,
//   images: [
//     {
//       id: 1,
//       name: "Angled view",
//       src: "https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg",
//       alt: "Angled front view with bag zipped and handles upright.",
//     },
//     // More images...
//   ],
//   colors: [
//     {
//       name: "Washed Black",
//       bgColor: "bg-zinc-700",
//       selectedColor: "ring-zinc-700",
//     },
//     { name: "White", bgColor: "bg-white", selectedColor: "ring-zinc-400" },
//     {
//       name: "Washed zinc",
//       bgColor: "bg-zinc-500",
//       selectedColor: "ring-zinc-500",
//     },
//   ],
//   description: `
//     <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
//   `,
//   details: [
//     {
//       name: "Features",
//       items: [
//         "Multiple strap configurations",
//         "Spacious interior with top zip",
//         "Leather handle and tabs",
//         "Interior dividers",
//         "Stainless strap loops",
//         "Double stitched construction",
//         "Water-resistant",
//       ],
//     },
//     // More sections...
//   ],
// };

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default async function Product({
  params,
}: {
  params: { productID: string };
}) {
  // const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  // const selectedColor2 = useSearchParams();
  function changeSelectedColor(color: string) {}
  const { productID } = params;
  const product = await prisma.product.findUnique({
    where: {
      id: productID,
    },
  });
  if (!product) return <div>NO product found</div>;
  const vendor = await prisma.vendor.findUnique({
    where: {
      id: product?.vendorId,
    },
  });
  return (
    <div className="">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          {/* <ImageGroup images={product.images} /> */}
          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight">{product.price}</p>
            </div>

            {/* Reviews */}
            {/* <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product.rating > rating
                          ? "text-indigo-500"
                          : "text-zinc-300",
                        "h-5 w-5 flex-shrink-0",
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
              </div>
            </div> */}

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-zinc-700 dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <form className="mt-6">
              {/* Colors */}
              {/* <div>
                <h3 className="text-sm ">Color</h3>

                <RadioGroup
                  value={selectedColor}
                  onChange={(ass: any) => {
                    console.log(ass);
                  }}
                  className="mt-2"
                >
                  <RadioGroup.Label className="sr-only">
                    Choose a color
                  </RadioGroup.Label>
                  <span className="flex items-center space-x-3">
                    {product.colors.map((color) => (
                      <RadioGroup.Option
                        key={color.name}
                        value={color}
                        className={({ active, checked }) =>
                          classNames(
                            color.selectedColor,
                            active && checked ? "ring ring-offset-1" : "",
                            !active && checked ? "ring-2" : "",
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none",
                          )
                        }
                      >
                        <RadioGroup.Label as="span" className="sr-only">
                          {color.name}
                        </RadioGroup.Label>
                        <span
                          aria-hidden="true"
                          className={classNames(
                            color.bgColor,
                            "h-8 w-8 rounded-full border border-black border-opacity-10",
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </span>
                </RadioGroup>
              </div> */}

              <div className="mt-10 flex">
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-50 sm:w-full"
                >
                  Add to bag
                </button>

                <button
                  type="button"
                  className=" ml-4 flex items-center justify-center rounded-md px-3 py-3 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-500"
                >
                  <HeartIcon
                    className="h-6 w-6 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>
            </form>

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              {/* <div className="divide-y divide-zinc-200 border-t dark:divide-zinc-100">
                {product.details.map((detail) => (
                  <Disclosure as="div" key={detail.name}>
                    {({ open }) => (
                      <>
                        <h3>
                          <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                            <span
                              className={classNames(
                                open ? "text-indigo-600 dark:text-zinc-50" : "",
                                "text-sm font-medium",
                              )}
                            >
                              {detail.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500 dark:text-zinc-50 dark:group-hover:text-zinc-50"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="block h-6 w-6 text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-200 dark:group-hover:text-zinc-100"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel
                          as="div"
                          className="prose prose-sm pb-6"
                        >
                          <ul role="list">
                            {detail.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div> */}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
