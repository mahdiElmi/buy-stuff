"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignInButton() {
  return (
    <Button
      className="h-min w-max rounded-md bg-gradient-to-tr from-zinc-200 to-zinc-50 text-base font-medium leading-none text-zinc-950 
      hover:to-white dark:from-zinc-800 dark:to-zinc-950 dark:text-zinc-50 dark:hover:to-zinc-900 dark:hover:text-white"
      onClick={() => signIn()}
      variant="outline"
    >
      Sign in
    </Button>
  );
}
