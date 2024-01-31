"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cartAtom } from "@/lib/atoms";
import { LocalShoppingCartItems } from "@/lib/types";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { ChevronLeft, ChevronRight, Trash, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import clearCart from "./ClearCartAction";
import deleteItemFromCart from "./DeleteCartItemAction";
import updateShoppingCartItemQuantity from "./UpdateCartItemAction";

function BigCart({
  cartItemsFromServer,
  userId,
}: {
  cartItemsFromServer: LocalShoppingCartItems;
  userId: string | null;
}) {
  useHydrateAtoms([[cartAtom, cartItemsFromServer]]);
  const [items, setItems] = useAtom(cartAtom);
  const [isPending, startTransition] = useTransition();
  const itemsArr = Object.values(items);
  const totalPrice = itemsArr.reduce((prevValue, item, i) => {
    return prevValue + item.price * item.quantity;
  }, 0);

  function handleSelectedQtyChange(
    isPositive: boolean,
    id: string,
    itemQuantity: number,
  ) {
    if (itemQuantity <= 1 && !isPositive) {
      handleDelete(id);
      return;
    }

    setItems((oldCart) => {
      return {
        ...oldCart,
        [id]: {
          ...oldCart[id],
          quantity: oldCart[id].quantity + (isPositive ? 1 : -1),
        },
      };
    });
    if (userId) {
      startTransition(async () => {
        const result = await updateShoppingCartItemQuantity(
          userId,
          id,
          isPositive,
        );
        console.log(result);
      });
    }
  }

  function handleDelete(id: string) {
    setItems((oldCart) => {
      const newCart = { ...oldCart };
      delete newCart[id];
      return newCart;
    });
    if (userId) {
      startTransition(async () => {
        const result = await deleteItemFromCart(userId, id);
        console.log(result);
      });
    }
  }

  function handleDeleteAll() {
    setItems({});
    if (userId) {
      startTransition(async () => {
        const result = await clearCart(userId);
        console.log(result);
      });
    }
  }

  if (itemsArr.length <= 0)
    return (
      <div className="flex h-full w-full max-w-7xl flex-grow flex-col items-center justify-center gap-2">
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
    <div className="mt-10 flex h-full w-full max-w-3xl flex-col gap-4 self-start">
      <div className="flex justify-between gap-5 pb-5">
        <h1 className=" text-4xl font-bold">Shopping Cart</h1>
        <Button
          onClick={handleDeleteAll}
          className="min-w-0 self-end font-bold"
          variant="secondary"
          size="sm"
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
            <span className="text-lg font-bold">{item.price}$</span>
          </div>
          <div className="ms-auto flex justify-self-end">
            <Button
              onClick={() =>
                handleSelectedQtyChange(false, item.productId, item.quantity)
              }
              className="rounded-r-none "
              variant={item.quantity <= 1 ? "destructive" : "ghost"}
              size="icon"
            >
              {item.quantity <= 1 ? <Trash /> : <ChevronLeft />}
            </Button>
            <span className=" flex h-10 w-10 items-center justify-center text-xl font-bold">
              {item.quantity}
            </span>
            <Button
              disabled={item.quantity >= item.stock}
              onClick={() =>
                handleSelectedQtyChange(true, item.productId, item.quantity)
              }
              className=" rounded-l-none "
              variant="ghost"
              size="icon"
            >
              <ChevronRight />
            </Button>
          </div>
          <Button
            onClick={() => handleDelete(item.productId)}
            variant="ghost"
            size="icon"
          >
            <X />
          </Button>
        </div>
      ))}
      <Separator className="my-3 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
      <div className="flex justify-between">
        <h2 className="self-end text-2xl font-bold">
          Total: {totalPrice.toLocaleString()}$
        </h2>
        <Button className="min-w-0 font-bold">Finalize Order</Button>
      </div>
    </div>
  );
}

export default BigCart;
