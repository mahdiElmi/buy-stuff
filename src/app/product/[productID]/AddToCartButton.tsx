"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

function AddToCartButton({ quantity }: { quantity: number }) {
  const [selectedQty, setSelectedQty] = useState("1");

  return (
    <div className="mt-5 flex gap-3">
      {quantity ? (
        <Select onValueChange={setSelectedQty} value={selectedQty}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="quantity" />
          </SelectTrigger>
          <SelectContent>
            {new Array(quantity).fill(1).map((_, i) => (
              <SelectItem value={`${i + 1}`}>{i + 1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="text-red-600">Out of Stock!</span>
      )}
      <Button disabled={quantity <= 0} className=" text-base tracking-tight">
        Add to Cart
      </Button>
    </div>
  );
}

export default AddToCartButton;
