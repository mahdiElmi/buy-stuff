"use client";

import { cartAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { Button } from "./ui/button";
import signOut from "@/actions/signOutAction";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const setCartItems = useSetAtom(cartAtom);

  function handleSignOut() {
    setCartItems({});
    startTransition(async () => {
      await signOut();
    });
  }

  return (
    <Button
      type="submit"
      disabled={isPending}
      className="flex w-full items-center justify-start gap-2 rounded-sm p-0 ps-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      variant="ghostHoverLess"
      size="sm"
      onClick={handleSignOut}
    >
      <LogOut className="h-5 w-5" />
      Sign Out
    </Button>
  );
}
