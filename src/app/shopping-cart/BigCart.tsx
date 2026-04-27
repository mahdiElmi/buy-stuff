"use client";
import { Button } from "@/components/ui/button";
import { cartAtom } from "@/lib/atoms";
import {
  LocalShoppingCartItem,
  LocalShoppingCartItems,
  ShoppingCartItemWithProduct,
} from "@/lib/types";
import { useAtom, useSetAtom } from "jotai";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader,
  ShoppingBag,
  Trash,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";

import { mergeCartItems, formatPrice } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  clearCart,
  deleteItemFromCart,
  updateShoppingCartItemQuantity,
  syncCart,
} from "./ShoppingCartActions";

export default function BigCart({
  cartItemsFromServer,
  userId,
}: {
  cartItemsFromServer: ShoppingCartItemWithProduct[];
  userId: string | null | undefined;
}) {
  const SHIPPING_ESTIMATE = 5.0 as const;

  const [items, setItems] = useAtom(cartAtom);
  const itemsArr = useMemo(() => {
    return Object.values(items);
  }, [items]);

  const [isMerging, setIsMerging] = useState(userId && itemsArr.length > 0);
  const [isPending, startTransition] = useTransition();

  const totalPrice = useMemo(() => {
    return cartItemsFromServer.reduce((prevValue, item) => {
      return prevValue + item.product.price * item.quantity;
    }, 0);
  }, [cartItemsFromServer]);

  const taxAmount = useMemo(() => {
    return totalPrice * 0.06;
  }, [totalPrice]);

  useEffect(() => {
    // if (userId) {
    //   const mergedItems = mergeCartItems(cartItemsFromServer, items, "server");
    //   setItems((oldItems) => mergedItems);
    // }
    // setIsMerging(false);

    if (userId && itemsArr.length > 0) {
      syncCart(itemsArr).then((result) => {
        console.log(result);
        setItems({});

        setIsMerging(false);
      });
    }
  }, [userId]);

  function handleDeleteAll() {
    if (userId) {
      startTransition(async () => {
        // const result = await clearCart();
        // if (result.success) {
        //   console.log(result);
        // }
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

  return (
    <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="w-full lg:col-span-7">
        <h2 id="cart-heading" className="sr-only">
          Items in your shopping cart
        </h2>
        <ul
          role="list"
          className="divide-y divide-zinc-200 border-b border-zinc-800 dark:divide-zinc-800 dark:border-zinc-800"
        >
          {!isMerging
            ? cartItemsFromServer.map((item, productIdx) => (
                <li key={item.productId} className="flex py-6 sm:py-10">
                  <div className="shrink-0">
                    <Image
                      width={200}
                      height={200}
                      src={item.product.images[0].url}
                      alt=""
                      className="size-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative flex flex-col pr-9 sm:gap-10">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link
                              href={`/product/${item.productId}`}
                              className="font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                            >
                              {item.product.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label
                          htmlFor={`quantity-${productIdx}`}
                          className="sr-only"
                        >
                          Quantity, {item.product.name}
                        </label>

                        <CartItemCountController item={item} userId={userId} />
                      </div>
                    </div>

                    <p className="mt-4 flex space-x-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {item.quantity <= item.product.stock ? (
                        <Check
                          className="size-5 shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <X
                          className="size-5 shrink-0 text-red-500"
                          aria-hidden="true"
                        />
                      )}

                      <span>
                        {item.quantity <= item.product.stock
                          ? "In stock"
                          : item.product.stock > 0
                            ? `Only ${item.product.stock} available`
                            : "Not In Stock"}
                      </span>
                    </p>
                  </div>
                </li>
              ))
            : [1, 2, 3, 4, 5].map((num) => <ItemSkeleton key={num} />)}
        </ul>

        {cartItemsFromServer.length <= 0 && (
          <div className="my-3 flex w-full flex-col items-center justify-center gap-2 rounded-md bg-zinc-200 py-5 dark:bg-zinc-800">
            <ShoppingBag className="size-10" />
            <h3 className="text-2xl font-bold">Cart is empty</h3>
            <Button
              variant="outline"
              className="border-zinc-400 bg-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 hover:dark:bg-zinc-900"
              asChild
            >
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Order summary */}
      <section
        aria-labelledby="summary-heading"
        className="sticky top-16 mt-16 w-full rounded-lg bg-zinc-100 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 dark:bg-zinc-900"
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
          <div className="flex items-center justify-between pt-2">
            <dt className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
              <span>Shipping estimate</span>
              {/* <a
                    href="#"
                    className="ml-2 shrink-0 text-zinc-400 hover:text-zinc-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="size-5"
                      aria-hidden="true"
                    />
                  </a> */}
            </dt>
            <dd className="text-sm font-medium">
              {isMerging ? (
                <Skeleton className="h-4 w-10" />
              ) : (
                formatPrice(
                  cartItemsFromServer.length > 0 ? SHIPPING_ESTIMATE : 0,
                )
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between pt-2">
            <dt className="flex text-sm text-zinc-600 dark:text-zinc-400">
              <span>Tax estimate</span>
              {/* <a
                    href="#"
                    className="ml-2 shrink-0 text-zinc-400 hover:text-zinc-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="size-5"
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
          <div className="flex items-center justify-between border-t border-zinc-200 pt-2 dark:border-zinc-800">
            <dt className="text-base font-medium">Order total</dt>
            <dd className="text-base font-medium">
              {isMerging ? (
                <Skeleton className="h-4 w-10" />
              ) : cartItemsFromServer.length <= 0 ? (
                "$0"
              ) : (
                formatPrice(totalPrice + SHIPPING_ESTIMATE + taxAmount)
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <Button
            asChild
            disabled={cartItemsFromServer.length <= 0}
            // onClick={handleOrderSubmit}
            className="w-full"
          >
            <Link href={userId ? "/checkout" : "/sign-in"}>Checkout</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function CartItemCountController({
  userId,
  item,
}: {
  userId: string | null | undefined;
  item: ShoppingCartItemWithProduct;
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
        const result = await deleteItemFromCart(id);
        // if (result.success) {
        //   console.log(result);
        //   setItems((oldCart) => {
        //     const newCart = { ...oldCart };
        //     delete newCart[id];
        //     return newCart;
        //   });
        // }
        console.log(result);
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
        const result = await updateShoppingCartItemQuantity(id, isPositive);
        // if (result.success) {
        //   setItems((oldCart) => {
        //     return {
        //       ...oldCart,
        //       [id]: {
        //         ...oldCart[id],
        //         quantity: oldCart[id].quantity + (isPositive ? 1 : -1),
        //       },
        //     };
        //   });
        //   console.log(result);
        // }
        console.log(result);
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
          className="size-8 rounded-r-none"
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
                <Trash aria-hidden="true" className="size-5" />
              </>
            )
          ) : (
            <>
              <span className="sr-only">Decrease item amount</span>
              <ChevronLeft aria-hidden="true" />
            </>
          )}
        </Button>
        <span className="flex size-8 items-center justify-center text-lg font-bold">
          {item.quantity}
        </span>
        <Button
          disabled={item.quantity >= item.product.stock || isPending}
          onClick={() =>
            handleSelectedQtyChange(true, item.productId, item.quantity)
          }
          className="size-8 rounded-l-none"
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
        className="absolute end-0 top-1 size-7 -translate-y-1"
      >
        <span className="sr-only">Remove item</span>
        {isPending && currentLoading === "delete" ? (
          <Loader aria-hidden="true" className="animate-spin" />
        ) : (
          <X
            className="size-5 text-zinc-700 dark:text-zinc-100"
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
      <Skeleton className="size-24 sm:h-48 sm:w-48" />
      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative flex flex-col pr-9 sm:gap-6">
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
