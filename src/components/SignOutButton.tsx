"use client";
import { cartAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutButton(props: React.ComponentProps<"button">) {
  const [isPending, startTransition] = useTransition();
  const setCartItems = useSetAtom(cartAtom);
  const router = useRouter();

  function handleSignOut() {
    setCartItems({});
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.push("/"),
        },
      });
    });
  }

  return (
    <Button
      type="button"
      disabled={isPending}
      className="flex w-full items-center justify-start gap-2 rounded-xs p-0 ps-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      variant="ghostHoverLess"
      size="sm"
      onClick={handleSignOut}
      {...props}
    >
      <LogOut className="size-5" />
      Sign Out
    </Button>
  );
}
