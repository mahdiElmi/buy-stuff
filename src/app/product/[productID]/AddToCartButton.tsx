"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState, useTransition } from "react";
import addToCart from "./AddToCartAction";
import { LocalShoppingCartItem, ProductWithImages } from "@/lib/types";
import { cartAtom } from "@/lib/atoms";
import { useAtom, useSetAtom } from "jotai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function AddToCartButton({
  quantity,
  userId,
  product,
}: {
  quantity: number;
  userId: string | null;
  product: ProductWithImages;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedQty, setSelectedQty] = useState("1");
  const [localCart, setLocalCart] = useAtom(cartAtom);
  const productFromCart: LocalShoppingCartItem | undefined = useMemo(
    () => localCart[product.id],
    [localCart, product],
  );

  const cartAdjustedQuantity = productFromCart
    ? quantity - productFromCart.quantity
    : quantity;

  function handleSubmit() {
    const cartLocalStateSnapshot = localCart;
    const selectedQtyNum = parseInt(selectedQty);
    setLocalCart((oldCart) => {
      if (productFromCart)
        return {
          ...oldCart,
          [product.id]: {
            ...oldCart[product.id],
            quantity: oldCart[product.id].quantity + selectedQtyNum,
          },
        };
      else {
        return {
          ...oldCart,
          [product.id]: {
            productId: product.id,
            name: product.name,
            quantity: selectedQtyNum,
            image: product.images[0].url,
            price: product.price,
            stock: quantity,
          },
        };
      }
    });

    setSelectedQty("1");
    toast.success(
      `added ${selectedQtyNum > 1 ? `(${selectedQtyNum})` : ""} ${product.name} to cart.`,
    );
    if (userId) {
      startTransition(async () => {
        const result = await addToCart(userId, selectedQtyNum, product.id);
        console.log(result);
        if (!result.success) {
          setLocalCart(cartLocalStateSnapshot);
          toast.error(
            `Something went wrong when adding ${selectedQtyNum > 1 ? `(${selectedQtyNum})` : ""} ${product.name} to cart.`,
            { description: result.cause },
          );
        }
      });
    }
  }

  return (
    <div className="mt-5 flex w-fit items-center gap-3">
      {quantity > 0 ? (
        <Select
          disabled={cartAdjustedQuantity <= 0}
          onValueChange={setSelectedQty}
          value={selectedQty}
        >
          <SelectTrigger className="w-16">
            <SelectValue placeholder="quantity" />
          </SelectTrigger>
          <SelectContent className="cursor-default">
            {new Array(cartAdjustedQuantity || 1).fill(1).map((_, i) => (
              <SelectItem key={i + 1} value={`${i + 1}`}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="rounded-md border-2 border-red-900  p-1 font-bold text-red-950 dark:text-red-200">
          Out of Stock!
        </span>
      )}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleSubmit}
              disabled={cartAdjustedQuantity <= 0}
              className={cn(" text-base tracking-tight", {
                "cursor-not-allowed": cartAdjustedQuantity <= 0,
              })}
            >
              Add to Cart
            </Button>
          </TooltipTrigger>
          {cartAdjustedQuantity <= 0 && (
            <TooltipContent>
              <span>
                You can&apos;t add more. You have the entire stock in your cart.
              </span>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <span className="self-end text-base font-medium tracking-wide text-zinc-700 dark:text-zinc-400">
        {productFromCart !== undefined && `${productFromCart.quantity} in cart`}
      </span>
    </div>
  );
}

export default AddToCartButton;
