import { prisma } from "@/lib/db";
import { format, formatISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import CopyToClickBoardButton from "./CopyToClickBoardButton";
import { formatPrice } from "@/lib/utils";

export default async function page(
  props: {
    params: Promise<{ orderId: string }>;
  }
) {
  const params = await props.params;
  const { orderId } = params;
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      id: true,
      shippingAddress: true,
      total: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          product: {
            select: {
              id: true,
              images: { select: { url: true } },
              name: true,
              description: true,
              price: true,
              vendor: {
                select: {
                  id: true,
                  imageURL: true,
                  name: true,
                },
              },
            },
          },
          quantity: true,
        },
      },
    },
  });

  if (!order) {
    return <div>no order found senior</div>;
  }

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight ">Order Details</h1>

        <div className="mt-2 border-b border-zinc-200 pb-5 text-sm dark:border-zinc-800 sm:flex sm:justify-between">
          <dl className="flex items-end">
            <dt className="min-w-max text-zinc-500">Order Identifier&nbsp;</dt>
            <dd className="relative flex items-end gap-1 font-medium sm:w-full">
              <span className="w-28 overflow-clip text-ellipsis">
                {order.id}
              </span>
              <CopyToClickBoardButton value={order.id} />
            </dd>
            <dt>
              <span className="sr-only">Date</span>
              <span
                className="mx-2 text-zinc-400 dark:text-zinc-600"
                aria-hidden="true"
              >
                &middot;
              </span>
            </dt>
            <dd className="min-w-max font-medium ">
              <time
                dateTime={formatISO(order.createdAt, {
                  representation: "date",
                })}
              >
                {format(order.createdAt, "MMM d, y")}
              </time>
              {/* <time dateTime="2021-03-22">March 22, 2021</time> */}
            </dd>
          </dl>
          {/* <div className="mt-4 sm:mt-0">
            <Link
              href="#"
              className="font-medium text-sky-600 hover:text-sky-500"
            >
              View invoice
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div> */}
        </div>

        <div className="mt-8">
          <h2 className="sr-only">Products purchased</h2>

          <div className="space-y-24">
            {order.items.map((cartItem) => (
              <div
                key={cartItem.id}
                className="grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-8"
              >
                <div className="sm:col-span-4 md:col-span-5 md:row-span-2 md:row-end-2">
                  <div className="aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                    <Image
                      src={cartItem.product.images[0].url}
                      width={500}
                      height={500}
                      alt=""
                      className="object-cover object-center"
                    />
                  </div>
                </div>
                <div className="mt-6 sm:col-span-7 sm:mt-0 md:row-end-1">
                  <h3 className="text-lg font-medium ">
                    <Link href={`/product/${cartItem.product.id}`}>
                      {cartItem.product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 font-medium ">
                    {formatPrice(cartItem.product.price)}
                  </p>
                  <p className="mt-3 text-zinc-500">
                    {cartItem.product.description}
                  </p>
                </div>
                <div className="sm:col-span-12 md:col-span-7">
                  <dl className="grid grid-cols-1 gap-y-8 border-b border-zinc-200 py-8 dark:border-zinc-800 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                    <div>
                      <dt className="font-medium ">Delivery address</dt>
                      <dd className="mt-3 text-zinc-500">
                        <span className="block">
                          {order.shippingAddress.city}
                        </span>
                        <span className="block">
                          {order.shippingAddress.address}
                        </span>
                        <span className="block">
                          {order.shippingAddress.phoneNumber}
                        </span>
                      </dd>
                    </div>
                    {/* <div>
                        <dt className="font-medium ">Shipping updates</dt>
                        <dd className="mt-3 space-y-3 text-zinc-500">
                          <p>{product.email}</p>
                          <p>{product.phone}</p>
                          <button
                            type="button"
                            className="font-medium text-sky-600 hover:text-sky-500"
                          >
                            Edit
                          </button>
                        </dd>
                      </div> */}
                  </dl>
                  <p className="mt-6 font-medium  md:mt-10">
                    {product.status} on{" "}
                    <time dateTime={product.datetime}>{product.date}</time>
                  </p>
                  <div className="mt-6">
                    <div className="overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-2 rounded-full bg-sky-600"
                        style={{
                          width: `calc((${product.step} * 2 + 1) / 8 * 100%)`,
                        }}
                      />
                    </div>
                    <div className="mt-6 hidden grid-cols-4 font-medium text-zinc-600 dark:text-zinc-400 sm:grid">
                      <div className="text-sky-600">Order placed</div>
                      <div
                        className={cn(
                          product.step > 0 ? "text-sky-600" : "",
                          "text-center",
                        )}
                      >
                        Processing
                      </div>
                      <div
                        className={cn(
                          product.step > 1 ? "text-sky-600" : "",
                          "text-center",
                        )}
                      >
                        Shipped
                      </div>
                      <div
                        className={cn(
                          product.step > 2 ? "text-sky-600" : "",
                          "text-right",
                        )}
                      >
                        Delivered
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing */}
        <div className="mt-24">
          <h2 className="sr-only">Billing Summary</h2>

          <div className="rounded-lg bg-zinc-100 px-6 py-6 dark:bg-zinc-900 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-0 lg:py-8">
            <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-5 lg:pl-8">
              <div>
                <dt className="font-medium ">Billing address</dt>
                <dd className="mt-3 text-zinc-500">
                  <span className="block">Floyd Miles</span>
                  <span className="block">7363 Cynthia Pass</span>
                  <span className="block">Toronto, ON N3Y 4H8</span>
                </dd>
              </div>
              <div>
                <dt className="font-medium ">Payment information</dt>
                <dd className="mt-3 flex">
                  <div>
                    <svg
                      aria-hidden="true"
                      width={100}
                      height={100}
                      fill-rule="evenodd"
                      className="h-6 w-auto"
                    >
                      <path d="M101.547 30.94c0-5.885-2.85-10.53-8.3-10.53-5.47 0-8.782 4.644-8.782 10.483 0 6.92 3.908 10.414 9.517 10.414 2.736 0 4.805-.62 6.368-1.494v-4.598c-1.563.782-3.356 1.264-5.632 1.264-2.23 0-4.207-.782-4.46-3.494h11.24c0-.3.046-1.494.046-2.046zM90.2 28.757c0-2.598 1.586-3.678 3.035-3.678 1.402 0 2.897 1.08 2.897 3.678zm-14.597-8.345c-2.253 0-3.7 1.057-4.506 1.793l-.3-1.425H65.73v26.805l5.747-1.218.023-6.506c.828.598 2.046 1.448 4.07 1.448 4.115 0 7.862-3.3 7.862-10.598-.023-6.667-3.816-10.3-7.84-10.3zm-1.38 15.84c-1.356 0-2.16-.483-2.713-1.08l-.023-8.53c.598-.667 1.425-1.126 2.736-1.126 2.092 0 3.54 2.345 3.54 5.356 0 3.08-1.425 5.38-3.54 5.38zm-16.4-17.196l5.77-1.24V13.15l-5.77 1.218zm0 1.747h5.77v20.115h-5.77zm-6.185 1.7l-.368-1.7h-4.966V40.92h5.747V27.286c1.356-1.77 3.655-1.448 4.368-1.195v-5.287c-.736-.276-3.425-.782-4.782 1.7zm-11.494-6.7L34.535 17l-.023 18.414c0 3.402 2.552 5.908 5.954 5.908 1.885 0 3.264-.345 4.023-.76v-4.667c-.736.3-4.368 1.356-4.368-2.046V25.7h4.368v-4.897h-4.37zm-15.54 10.828c0-.897.736-1.24 1.954-1.24a12.85 12.85 0 0 1 5.7 1.47V21.47c-1.908-.76-3.793-1.057-5.7-1.057-4.667 0-7.77 2.437-7.77 6.506 0 6.345 8.736 5.333 8.736 8.07 0 1.057-.92 1.402-2.207 1.402-1.908 0-4.345-.782-6.276-1.84v5.47c2.138.92 4.3 1.3 6.276 1.3 4.782 0 8.07-2.368 8.07-6.483-.023-6.85-8.782-5.632-8.782-8.207z" />
                    </svg>
                    <p className="sr-only">Stripe</p>
                  </div>
                  <div className="ml-4">
                    <p className="">Ending with 4242</p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Expires 02 / 24
                    </p>
                  </div>
                </dd>
              </div>
            </dl>

            <dl className="mt-8 divide-y divide-zinc-200 text-sm dark:divide-zinc-800 lg:col-span-7 lg:mt-0 lg:pr-8">
              <div className="flex items-center justify-between pb-4">
                <dt className="text-zinc-600 dark:text-zinc-400">Subtotal</dt>
                <dd className="font-medium ">$72</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-zinc-600 dark:text-zinc-400">Shipping</dt>
                <dd className="font-medium ">$5</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-zinc-600 dark:text-zinc-400">Tax</dt>
                <dd className="font-medium ">$6.16</dd>
              </div>
              <div className="flex items-center justify-between pt-4">
                <dt className="font-medium ">Order total</dt>
                <dd className="font-medium text-sky-600">$83.16</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
