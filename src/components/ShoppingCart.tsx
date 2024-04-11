"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Loader, ShoppingCartIcon, Trash, X } from "lucide-react";
import { LocalShoppingCartItems } from "@/lib/types";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAtom } from "jotai";
import { cartAtom } from "@/lib/atoms";
import { Separator } from "./ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { mergeCartItems, formatPrice, cn } from "@/lib/utils";
import deleteItemFromCart from "@/app/shopping-cart/deleteCartItemAction";
import { useEffect, useMemo, useState, useTransition } from "react";

export default function ShoppingCart({
  cartItemsFromServer,
  userId,
}: {
  cartItemsFromServer: LocalShoppingCartItems;
  userId: string | null;
}) {
  const [items, setItems] = useAtom(cartAtom);
  const [isPending, startTransition] = useTransition();
  const [isMerging, setIsMerging] = useState(true);
  const itemsArr = useMemo(() => {
    return Object.values(items);
  }, [items]);

  const cartItemsCount = useMemo(() => {
    let sum = 0;
    for (const item of itemsArr) {
      sum += item.quantity;
    }
    return sum;
  }, [itemsArr]);

  const totalPrice = itemsArr.reduce(
    (prevValue, item, i) => prevValue + item.price * item.quantity,
    0,
  );
  function handleDelete(id: string) {
    if (userId) {
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
  useEffect(() => {
    if (userId) {
      setItems((oldItems) =>
        mergeCartItems(cartItemsFromServer, oldItems, "server"),
      );
    }
    setIsMerging(false);
  }, [cartItemsFromServer, setItems, userId]);

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild className="relative md:hidden">
          <Button variant="ghostHoverLess" className="relative" size="icon">
            <span
              className={cn(
                "absolute end-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 p-1 text-xs font-bold dark:bg-zinc-700",
                isMerging && "animate-pulse",
              )}
            >
              {!isMerging && cartItemsCount}
            </span>
            <ShoppingCartIcon className="h-7 w-7" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex justify-center gap-2">
            <ShoppingCartIcon className="h-6 w-6" />
            <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-300">
              Shopping Cart
            </h4>
          </DrawerHeader>
          <div className="w-full px-5">
            {cartItemsCount > 0 ? (
              <ScrollArea className="h-52 w-full pe-2">
                {itemsArr.map((item) => (
                  <div
                    className="mb-3 flex w-full items-center gap-2"
                    key={item.productId}
                  >
                    <Link
                      className="w-fit flex-shrink-0"
                      href={`/product/${item.productId}`}
                    >
                      <Image
                        className="h-12 w-12 rounded-md border-2 dark:border-zinc-800 "
                        alt="product image"
                        src={item.image}
                        width={36}
                        height={36}
                      />
                    </Link>
                    <div className="flex h-full flex-shrink flex-col justify-between self-start">
                      <Link
                        href={`/product/${item.productId}`}
                        title={item.name}
                        className=" truncate text-wrap break-words text-sm font-semibold hover:underline"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs font-bold">{item.price}$</span>
                    </div>
                    <div className="ms-auto flex gap-1">
                      <span className="flex items-center justify-center font-semibold">
                        x{item.quantity}
                      </span>
                      <Button
                        className=""
                        onClick={() => handleDelete(item.productId)}
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                      >
                        <span className="sr-only">Delete Item</span>
                        {isPending ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <Trash />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="flex w-full items-center justify-center py-8 text-lg">
                Shopping cart is empty!
              </div>
            )}
          </div>
          <Separator />
          <DrawerFooter className="flex flex-row items-center justify-between gap-4 px-5 py-2">
            <span className=" text-sm font-bold">
              Total: {formatPrice(totalPrice)}$
            </span>
            <Button
              asChild
              size="sm"
              className="my-2 h-7 w-fit self-end px-2 text-sm font-bold"
            >
              <Link href="/shopping-cart">continue</Link>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghostHoverLess"
            className="relative hidden md:flex"
            size="icon"
          >
            <span
              className={cn(
                "absolute end-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 p-1 text-xs font-bold dark:bg-zinc-700",
                isMerging && "animate-pulse",
              )}
            >
              {!isMerging && cartItemsCount}
            </span>
            <ShoppingCartIcon className="h-7 w-7" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent asChild>
          <div className="flex w-full flex-col">
            <DropdownMenuLabel>
              <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-300">
                Shopping Cart
              </h4>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cartItemsCount > 0 ? (
              <ScrollArea className="h-48 pe-2">
                {itemsArr.map((item) => (
                  <DropdownMenuItem key={item.productId} asChild>
                    <div
                      key={item.productId}
                      className="flex items-center gap-2"
                    >
                      <Link
                        className="w-fit flex-shrink-0"
                        href={`/product/${item.productId}`}
                      >
                        <Image
                          className="h-9 w-9 rounded-md border-2 dark:border-zinc-800 "
                          alt="product image"
                          src={item.image}
                          width={36}
                          height={36}
                        />
                      </Link>
                      <div className="flex h-full flex-col justify-between self-start">
                        <Link
                          href={`/product/${item.productId}`}
                          title={item.name}
                          className=" max-w-36 flex-shrink truncate text-xs font-semibold hover:underline"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs font-bold">{item.price}$</span>
                      </div>
                      <span className="ms-auto flex items-center justify-center font-semibold">
                        x{item.quantity}
                      </span>
                      <Button
                        className="h-5 w-5"
                        onClick={() => handleDelete(item.productId)}
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                      >
                        <span className="sr-only">Delete Item</span>
                        {isPending ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <Trash />
                        )}
                      </Button>
                    </div>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            ) : (
              <div className="flex w-64 items-center justify-center py-8 text-lg">
                Shopping cart is empty!
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between gap-4 px-2">
              <span className="text-sm font-bold">
                Total: {formatPrice(totalPrice)}$
              </span>
              <Button
                asChild
                size="sm"
                className="my-2 h-7 w-fit self-end px-2 text-sm font-bold"
              >
                <Link href="/shopping-cart">continue</Link>
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
