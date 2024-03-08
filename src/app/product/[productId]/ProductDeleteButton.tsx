"use client";

import { deleteProduct } from "@/actions/DeleteProductAction";
import { Button } from "@/components/ui/button";
import { Loader, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function ProductDeleteButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result.success) router.push("/");
      else {
        toast.error(
          "Product deletion failed.",
          result.cause ? { description: result.cause } : {},
        );
      }
    });
  }
  return (
    <Button
      className="h-8 w-8 p-0"
      variant="outline"
      title="Delete Product"
      disabled={isPending}
      onClick={handleDelete}
    >
      <span className="sr-only">Delete product</span>
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Trash className="h-4 w-4" />
      )}
    </Button>
  );
}
