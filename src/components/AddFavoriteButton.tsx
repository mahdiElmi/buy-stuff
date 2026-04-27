"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeartIcon, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import {
  addToFavorites,
  removeFromFavorites,
} from "../actions/favoritesActions";
import { VariantProps } from "class-variance-authority";
export default function AddFavoriteButton({
  favoriteInitialState,
  productId,
  variant = "ghostHoverLess",
  className,
}: {
  favoriteInitialState: boolean;
  productId: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
}) {
  const [hasLiked, setHasLiked] = useState(favoriteInitialState);
  const [isPending, startTransition] = useTransition();

  function HandleClick() {
    if (hasLiked) {
      startTransition(async () => {
        const result = await removeFromFavorites(productId);
        if (result.success) setHasLiked((oldState) => !oldState);
      });
    } else {
      startTransition(async () => {
        const result = await addToFavorites(productId);
        if (result.success) setHasLiked((oldState) => !oldState);
      });
    }
  }

  return (
    <Button
      className={className}
      variant={variant}
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.stopPropagation();

        HandleClick();
      }}
      size="icon"
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <HeartIcon className={cn(hasLiked && "fill-current", "size-5")} />
      )}
    </Button>
  );
}
