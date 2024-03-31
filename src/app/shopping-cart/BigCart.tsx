"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cartAtom } from "@/lib/atoms";
import { LocalShoppingCartItem, LocalShoppingCartItems } from "@/lib/types";
import { useAtom, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import clearCart from "./ClearCartAction";
import deleteItemFromCart from "./DeleteCartItemAction";
import updateShoppingCartItemQuantity from "./UpdateCartItemAction";
import { mergeCartItems, formatPrice } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BigCart({
  cartItemsFromServer,
  userId,
}: {
  cartItemsFromServer: LocalShoppingCartItems;
  userId: string | null;
}) {
  const SHIPPING_ESTIMATE = 5.0 as const;

  const [items, setItems] = useAtom(cartAtom);
  // useHydrateAtoms([
  //   [cartAtom, mergeCartItems(cartItemsFromServer, items, "client")],
  // ]);
  const [isMerging, setIsMerging] = useState(!!userId);
  const [isPending, startTransition] = useTransition();

  const itemsArr = useMemo(() => {
    return Object.values(items);
  }, [items]);

  const totalPrice = useMemo(() => {
    return itemsArr.reduce((prevValue, item, i) => {
      return prevValue + item.price * item.quantity;
    }, 0);
  }, [itemsArr]);

  const taxAmount = useMemo(() => {
    return totalPrice * 0.06;
  }, [totalPrice]);

  useEffect(() => {
    if (userId) {
      setItems((oldItems) =>
        mergeCartItems(cartItemsFromServer, oldItems, "server"),
      );
      setIsMerging(false);
    }
  }, [cartItemsFromServer, setItems, userId]);

  function handleDeleteAll() {
    if (userId) {
      startTransition(async () => {
        const result = await clearCart(userId);
        if (result.success) {
          setItems({});
          console.log(result);
        }
      });
    } else {
      setItems({});
    }
  }
  function handleOrderSubmit() {
    if (userId) {
      handleDeleteAll();
    } else {
      signIn();
    }
  }
  // useEffect(() => {
  //   setItems((oldItems) =>
  //     mergeCartItems(cartItemsFromServer, oldItems, "client"),
  //   );
  // }, []);
  // if (itemsArr.length <= 0)
  //   return (
  //     <div className="flex h-fit min-h-screen w-full max-w-7xl flex-grow flex-col items-center justify-center gap-2">
  //       <h1 className="text-5xl font-bold">Cart is Empty!</h1>
  //       <p className="text-3xl font-semibold dark:text-zinc-100">
  //         you can browse our products{" "}
  //         <Link className="text-violet-600 hover:underline" href="/products">
  //           here
  //         </Link>
  //         .
  //       </p>
  //     </div>
  //   );

  // return (
  //   <div className="mt-10 flex h-fit min-h-screen w-full max-w-3xl flex-col gap-4 self-start">
  //     <div className="flex justify-between gap-5 pb-5">
  //       <h1 className=" text-4xl font-bold">Shopping Cart</h1>
  //       <Button
  //         onClick={handleDeleteAll}
  //         className="min-w-0 self-end font-bold"
  //         variant="secondary"
  //         size="sm"
  //         disabled={isPending}
  //       >
  //         <Trash2 className="me-1 h-5 w-5" />
  //         Empty Cart
  //       </Button>
  //     </div>
  //     {itemsArr.map((item) => (
  //       <div key={item.productId} className="flex items-center gap-2 ">
  //         <Link href={`/product/${item.productId}`}>
  //           <Image
  //             className="h-20 w-20 rounded-lg shadow-2xl"
  //             alt="product image"
  //             src={item.image}
  //             width={80}
  //             height={80}
  //           />
  //         </Link>
  //         <div className="flex h-full flex-col gap-1 self-start">
  //           <Link
  //             href={`/product/${item.productId}`}
  //             title={item.name}
  //             className="text-xl font-semibold hover:underline"
  //           >
  //             {item.name}
  //           </Link>
  //           <span className="text-lg font-bold">${item.price}</span>
  //         </div>
  //         <CartItemCountController item={item} userId={userId} />
  //       </div>
  //     ))}
  //     <Separator className="my-3 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
  //     <div className="flex justify-between">
  //       <h2 className="self-end text-2xl font-bold">
  //         Total: {formatPrice(totalPrice)}
  //       </h2>
  //       <Button
  //         onClick={handleOrderSubmit}
  //         disabled={isPending}
  //         className="min-w-0 font-bold"
  //       >
  //         Finalize Order
  //       </Button>
  //     </div>
  //   </div>
  // );

  return (
    <form
      onSubmit={handleOrderSubmit}
      className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
    >
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
        <h2 id="cart-heading" className="sr-only">
          Items in your shopping cart
        </h2>

        <ul
          role="list"
          className="divide-y divide-zinc-200 border-b border-t border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800"
        >
          {!isMerging
            ? itemsArr.map((product, productIdx) => (
                <li key={product.productId} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <Image
                      width={200}
                      height={200}
                      src={product.image}
                      alt=""
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative flex flex-col pr-9 sm:gap-10 ">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link
                              href={`/product/${product.productId}`}
                              className="font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                            >
                              {product.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      <div className=" mt-4 sm:mt-0 sm:pr-9">
                        <label
                          htmlFor={`quantity-${productIdx}`}
                          className="sr-only"
                        >
                          Quantity, {product.name}
                        </label>

                        <CartItemCountController
                          item={product}
                          userId={userId}
                        />
                      </div>
                    </div>

                    <p className="mt-4 flex space-x-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {product.quantity <= product.stock ? (
                        <Check
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <X
                          className="h-5 w-5 flex-shrink-0 text-red-500"
                          aria-hidden="true"
                        />
                      )}

                      <span>
                        {product.quantity <= product.stock
                          ? "In stock"
                          : product.stock > 0
                            ? `Only ${product.stock} available`
                            : "Not In Stock"}
                      </span>
                    </p>
                  </div>
                </li>
              ))
            : [1, 2, 3, 4, 5].map((num) => <ItemSkeleton key={num} />)}
        </ul>
      </section>

      {/* Order summary */}
      <section
        aria-labelledby="summary-heading"
        className="sticky top-16 mt-16 rounded-lg bg-zinc-100 px-4 py-6 dark:bg-zinc-900 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
      >
        <h2 id="summary-heading" className="text-lg font-medium">
          Order summary
        </h2>

        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-zinc-600 dark:text-zinc-400">
              Subtotal
            </dt>
            {isMerging ? (
              <Skeleton className="h-4 w-10" />
            ) : (
              <dd className="text-sm font-medium">{formatPrice(totalPrice)}</dd>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <dt className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
              <span>Shipping estimate</span>
              {/* <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-zinc-400 hover:text-zinc-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a> */}
            </dt>
            <dd className="text-sm font-medium">
              {isMerging ? (
                <Skeleton className="h-4 w-10" />
              ) : (
                formatPrice(itemsArr.length > 0 ? SHIPPING_ESTIMATE : 0)
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <dt className="flex text-sm text-zinc-600 dark:text-zinc-400">
              <span>Tax estimate</span>
              {/* <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-zinc-400 hover:text-zinc-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a> */}
            </dt>
            {isMerging ? (
              <Skeleton className="h-4 w-10" />
            ) : (
              <dd className="text-sm font-medium">{formatPrice(taxAmount)}</dd>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <dt className="text-base font-medium">Order total</dt>
            <dd className="text-base font-medium">
              {isMerging ? (
                <Skeleton className="h-4 w-10" />
              ) : (
                formatPrice(totalPrice + SHIPPING_ESTIMATE + taxAmount)
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <button
            type="submit"
            disabled={itemsArr.length <= 0}
            className="w-full rounded-md border border-transparent bg-indigo-800 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-50"
          >
            Checkout
          </button>
        </div>
      </section>
    </form>
  );
}

function CartItemCountController({
  userId,
  item,
}: {
  userId: string | null;
  item: LocalShoppingCartItem;
}) {
  const [isPending, startTransition] = useTransition();
  const [currentLoading, setCurrentLoading] = useState<
    "deleteTrashIcon" | "increment" | "decrement" | "delete"
  >();
  const setItems = useSetAtom(cartAtom);

  function handleDelete(id: string) {
    if (userId) {
      setCurrentLoading("delete");
      startTransition(async () => {
        const result = await deleteItemFromCart(userId, id);
        if (result.success) {
          console.log(result);
          setItems((oldCart) => {
            const newCart = { ...oldCart };
            delete newCart[id];
            return newCart;
          });
        }
      });
    } else {
      setItems((oldCart) => {
        const newCart = { ...oldCart };
        delete newCart[id];
        return newCart;
      });
    }
  }

  function handleSelectedQtyChange(
    isPositive: boolean,
    id: string,
    itemQuantity: number,
  ) {
    if (itemQuantity <= 1 && !isPositive) {
      handleDelete(id);
      return;
    }

    if (userId) {
      setCurrentLoading(isPositive ? "increment" : "decrement");

      startTransition(async () => {
        const result = await updateShoppingCartItemQuantity(
          userId,
          id,
          isPositive,
        );
        if (result.success) {
          setItems((oldCart) => {
            return {
              ...oldCart,
              [id]: {
                ...oldCart[id],
                quantity: oldCart[id].quantity + (isPositive ? 1 : -1),
              },
            };
          });
          console.log(result);
        }
      });
    } else {
      setItems((oldCart) => {
        return {
          ...oldCart,
          [id]: {
            ...oldCart[id],
            quantity: oldCart[id].quantity + (isPositive ? 1 : -1),
          },
        };
      });
    }
  }

  return (
    <>
      <div className="ms-auto flex justify-self-end">
        <Button
          disabled={isPending}
          onClick={() =>
            handleSelectedQtyChange(false, item.productId, item.quantity)
          }
          className="h-8 w-8 rounded-r-none"
          variant={item.quantity <= 1 ? "destructive" : "ghost"}
          size="icon"
        >
          {isPending && currentLoading === "decrement" ? (
            <Loader aria-hidden="true" className="animate-spin" />
          ) : item.quantity <= 1 ? (
            isPending && currentLoading === "deleteTrashIcon" ? (
              <Loader aria-hidden="true" className="animate-spin" />
            ) : (
              <>
                <span className="sr-only">Remove item</span>
                <Trash aria-hidden="true" className="h-5 w-5 " />
              </>
            )
          ) : (
            <>
              <span className="sr-only">Decrease item amount</span>
              <ChevronLeft aria-hidden="true" />
            </>
          )}
        </Button>
        <span className=" flex h-8 w-8 items-center justify-center text-lg font-bold">
          {item.quantity}
        </span>
        <Button
          disabled={item.quantity >= item.stock || isPending}
          onClick={() =>
            handleSelectedQtyChange(true, item.productId, item.quantity)
          }
          className=" h-8 w-8 rounded-l-none  "
          variant="ghost"
          size="icon"
        >
          <span className="sr-only">Increase item amount</span>

          {isPending && currentLoading === "increment" ? (
            <Loader aria-hidden="true" className="animate-spin" />
          ) : (
            <ChevronRight aria-hidden="true" />
          )}
        </Button>
      </div>
      <Button
        disabled={isPending}
        onClick={() => handleDelete(item.productId)}
        variant="ghost"
        size="icon"
        className="absolute end-0 top-1 h-7 w-7 -translate-y-1"
      >
        <span className="sr-only">Remove item</span>
        {isPending && currentLoading === "delete" ? (
          <Loader aria-hidden="true" className="animate-spin" />
        ) : (
          <X
            className="h-5 w-5 text-zinc-700 dark:text-zinc-100 "
            aria-hidden="true"
          />
        )}
      </Button>
    </>
  );
}

function ItemSkeleton() {
  return (
    <li className="flex w-full py-6 sm:w-[583px] sm:py-10">
      <Skeleton className="h-24 w-24 sm:h-48 sm:w-48" />
      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative flex flex-col pr-9 sm:gap-6 ">
          <div>
            <Skeleton className="h-6 w-52 md:w-60" />
            <Skeleton className="mt-1 h-4 w-7" />
          </div>
          <Skeleton className="mt-4 h-10 w-28" />
        </div>
        <Skeleton className="mt-4 h-6 w-20" />
      </div>
    </li>
  );
}
