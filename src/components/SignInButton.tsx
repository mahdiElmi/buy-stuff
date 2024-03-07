"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignInButton() {
  return (
    <Button
      className="h-min w-max rounded-lg text-xl font-medium leading-none text-zinc-950 dark:text-zinc-50 
              dark:hover:text-white  "
      onClick={() => signIn()}
      variant="outline"
    >
      Sign In
    </Button>
  );
}
