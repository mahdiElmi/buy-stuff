"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function SignInButton() {
  return (
    <Button
      className="h-min w-max rounded-md p-0 text-xs leading-none font-bold md:text-sm dark:hover:to-zinc-900 dark:hover:text-white"
      onClick={() =>
        authClient.signIn.social({ provider: "github", callbackURL: "/" })
      }
      variant="link"
    >
      Sign in
    </Button>
  );
}
