"use client";
import { TrashIcon } from "lucide-react";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function DeleteButton({
  id,
  deleteAction,
}: {
  id: string;
  deleteAction: (id: string) => Promise<boolean>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  function handleClick() {
    startTransition(async () => {
      const result = await deleteAction(id);
      if (result) {
        toast.success("Deleted successfully.");
        router.refresh();
      } else toast.error("Could not delete. Try again later.");
    });
  }
  return (
    <Button
      variant="ghostHoverLess"
      size="icon"
      disabled={isPending}
      type="button"
      onClick={handleClick}
      className=" ml-4 flex items-center justify-center rounded-md px-3 py-3 text-zinc-500  hover:text-zinc-600  dark:hover:text-zinc-400"
    >
      <TrashIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
      {/* #TODO add dialog modal thingy to make sure the mf wants to delete */}
      <span className="sr-only">Delete Product</span>
    </Button>
  );
}

export default DeleteButton;
