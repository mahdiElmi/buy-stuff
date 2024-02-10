"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCartIcon, Trash, X } from "lucide-react";
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
import { useHydrateAtoms } from "jotai/utils";
import { cartAtom } from "@/lib/atoms";
import { Separator } from "./ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

function ShoppingCart({
  cartItemsFromServer,
}: {
  cartItemsFromServer: LocalShoppingCartItems;
}) {
  useHydrateAtoms([[cartAtom, cartItemsFromServer]]);
  const [items, setItems] = useAtom(cartAtom);

  const itemsArr = Object.values(items);
  const totalPrice = itemsArr.reduce(
    (prevValue, item, i) => prevValue + item.price * item.quantity,
    0,
  );
  function handleDelete(id: string) {
    setItems((oldCart) => {
      const newCart = { ...oldCart };
      delete newCart[id];
      return newCart;
    });
  }

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild className="relative md:hidden">
          <Button variant="ghostHoverLess" className="relative" size="icon">
            <span className="absolute end-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 p-1 text-xs font-bold dark:bg-zinc-700">
              {itemsArr.length}
            </span>
            <ShoppingCartIcon className="h-7 w-7" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          {/* <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
          <DrawerHeader className="flex justify-center gap-2">
            <ShoppingCartIcon className="h-6 w-6" />
            <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-300">
              Shopping Cart
            </h4>
          </DrawerHeader>
          <div className="flex w-full flex-col px-5">
            {itemsArr.length > 0 ? (
              <ScrollArea className="h-48 pe-2">
                {itemsArr.map((item) => (
                  <div
                    className="mb-3 flex items-center gap-2"
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
                    <div className="flex h-full flex-col justify-between self-start">
                      <Link
                        href={`/product/${item.productId}`}
                        title={item.name}
                        className=" flex-shrink truncate text-sm font-semibold hover:underline"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs font-bold">{item.price}$</span>
                    </div>
                    <span className="ms-auto flex items-center justify-center font-semibold">
                      x{item.quantity}
                    </span>
                    <Button
                      className=""
                      onClick={() => handleDelete(item.productId)}
                      variant="ghost"
                      size="icon"
                    >
                      <Trash />
                    </Button>
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
              Total: {totalPrice.toLocaleString()}$
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
            {/* <Link href="/shopping-cart" className="relative"> */}
            <span className="absolute end-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 p-1 text-xs font-bold dark:bg-zinc-700">
              {itemsArr.length}
            </span>
            <ShoppingCartIcon className="h-7 w-7" />
            {/* </Link> */}
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
            {itemsArr.length > 0 ? (
              <ScrollArea className="h-48 pe-2">
                {itemsArr.map((item) => (
                  <DropdownMenuItem asChild>
                    <div
                      className="flex items-center gap-2"
                      key={item.productId}
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
                      >
                        <Trash />
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
                Total: {totalPrice.toLocaleString()}$
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

export default ShoppingCart;
