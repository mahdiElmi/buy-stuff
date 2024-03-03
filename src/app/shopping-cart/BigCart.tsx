"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cartAtom } from "@/lib/atoms";
import { LocalShoppingCartItem, LocalShoppingCartItems } from "@/lib/types";
import { useAtom, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import {
  ChevronLeft,
  ChevronRight,
  Loader,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import clearCart from "./ClearCartAction";
import deleteItemFromCart from "./DeleteCartItemAction";
import updateShoppingCartItemQuantity from "./UpdateCartItemAction";
import { MergeCartItems, formatPrice } from "@/lib/utils";

export default function BigCart({
  cartItemsFromServer,
  userId,
}: {
  cartItemsFromServer: LocalShoppingCartItems;
  userId: string | null;
}) {
  const [items, setItems] = useAtom(cartAtom);
  useHydrateAtoms([
    [cartAtom, MergeCartItems(cartItemsFromServer, items, "client")],
  ]);
  const [isPending, startTransition] = useTransition();
  const itemsArr = Object.values(items);
  const totalPrice = itemsArr.reduce((prevValue, item, i) => {
    return prevValue + item.price * item.quantity;
  }, 0);

  function handleDeleteAll() {
    if (userId) {
      startTransition(async () => {
        const result = await clearCart(userId);
        if (result.success) {
          setItems({});
          console.log(result);
        }
      });
    }
  }

  if (itemsArr.length <= 0)
    return (
      <div className="flex h-fit min-h-screen w-full max-w-7xl flex-grow flex-col items-center justify-center gap-2">
        <h1 className="text-5xl font-bold">Cart is Empty!</h1>
        <p className="text-3xl font-semibold dark:text-zinc-100">
          you can browse our products{" "}
          <Link className="text-violet-600 hover:underline" href="/products">
            here
          </Link>
          .
        </p>
      </div>
    );

  return (
    <div className="mt-10 flex h-fit min-h-screen w-full max-w-3xl flex-col gap-4 self-start">
      <div className="flex justify-between gap-5 pb-5">
        <h1 className=" text-4xl font-bold">Shopping Cart</h1>
        <Button
          onClick={handleDeleteAll}
          className="min-w-0 self-end font-bold"
          variant="secondary"
          size="sm"
          disabled={isPending}
        >
          <Trash2 className="me-1 h-5 w-5" />
          Empty Cart
        </Button>
      </div>
      {itemsArr.map((item) => (
        <div key={item.productId} className="flex items-center gap-2 ">
          <Link href={`/product/${item.productId}`}>
            <Image
              className="h-20 w-20 rounded-lg shadow-2xl"
              alt="product image"
              src={item.image}
              width={80}
              height={80}
            />
          </Link>
          <div className="flex h-full flex-col gap-1 self-start">
            <Link
              href={`/product/${item.productId}`}
              title={item.name}
              className="text-xl font-semibold hover:underline"
            >
              {item.name}
            </Link>
            <span className="text-lg font-bold">${item.price}</span>
          </div>
          <CartItemCountController item={item} userId={userId} />
        </div>
      ))}
      <Separator className="my-3 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
      <div className="flex justify-between">
        <h2 className="self-end text-2xl font-bold">
          Total: {formatPrice(totalPrice)}
        </h2>
        <Button
          onClick={handleDeleteAll}
          disabled={isPending}
          className="min-w-0 font-bold"
        >
          Finalize Order
        </Button>
      </div>
    </div>
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
    "delete" | "increment" | "decrement"
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
          className="rounded-r-none "
          variant={item.quantity <= 1 ? "destructive" : "ghost"}
          size="icon"
        >
          {isPending && currentLoading === "decrement" ? (
            <Loader className="animate-spin" />
          ) : item.quantity <= 1 ? (
            isPending && currentLoading === "delete" ? (
              <Loader className="animate-spin" />
            ) : (
              <Trash />
            )
          ) : (
            <ChevronLeft />
          )}
        </Button>
        <span className=" flex h-10 w-10 items-center justify-center text-xl font-bold">
          {item.quantity}
        </span>
        <Button
          disabled={item.quantity >= item.stock || isPending}
          onClick={() =>
            handleSelectedQtyChange(true, item.productId, item.quantity)
          }
          className=" rounded-l-none "
          variant="ghost"
          size="icon"
        >
          {isPending && currentLoading === "increment" ? (
            <Loader className="animate-spin" />
          ) : (
            <ChevronRight />
          )}
        </Button>
      </div>
      <Button
        disabled={isPending}
        onClick={() => handleDelete(item.productId)}
        variant="ghost"
        size="icon"
      >
        {isPending && currentLoading === "delete" ? (
          <Loader className="animate-spin" />
        ) : (
          <X />
        )}
      </Button>
    </>
  );
}
