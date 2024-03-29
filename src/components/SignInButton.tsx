"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignInButton() {
  return (
    <Button
      className="h-min w-max rounded-md p-0 text-xs font-bold leading-none   
       dark:hover:to-zinc-900 dark:hover:text-white md:text-sm"
      onClick={() => signIn()}
      variant="link"
    >
      Sign in
    </Button>
  );
}
