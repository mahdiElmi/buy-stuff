"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { addToFavorites, removeFromFavorites } from "./FavoritesActions";

export default function AddFavoriteButton({
  favoriteInitialState,
  productId,
  variant = "outline",
  className,
}: {
  favoriteInitialState: boolean;
  productId: string;
  variant?: "outline" | "ghostHoverLess";
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
        <Heart className={cn(hasLiked && "fill-current")} />
      )}
    </Button>
  );
}
