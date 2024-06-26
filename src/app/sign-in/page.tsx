"use client";
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import logIn from "./logInAction";
import { toast } from "sonner";

export default function Page({
  searchParams,
}: {
  searchParams: { callback: string | undefined; error: string | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { callback = "/", error: authError } = searchParams;
  const [clickedProvider, setClickedProvider] = useState("github");
  //OAuthAccountNotLinked: If the email on the account is already linked, but not with this OAuth account
  useEffect(() => {
    if (authError === "OAuthAccountNotLinked") {
      toast.error("We couldn't log you in!", {
        description:
          "The emails is already linked to an account. Try other ways to log in.",
      });
    }
  }, [authError]);

  function handleLogIn(provider: "github" | "google") {
    setClickedProvider(provider);
    startTransition(async () => {
      await logIn(provider, callback);
    });
  }

  return (
    <section className="flex h-[90dvh] w-full items-center justify-center">
      <div className="flex max-w-96 flex-col items-center justify-center gap-2 rounded-md border-2 border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-800 dark:bg-zinc-900 ">
        <h1 className="mb-4 text-center text-3xl font-bold tracking-tight">
          Sign In
        </h1>
        {authError !== undefined && (
          <p className="mb-1 rounded-md border-2 border-yellow-600 p-1 text-center text-yellow-700 dark:text-yellow-300">
            {authError === "OAuthAccountNotLinked"
              ? "The emails is already linked to an account with another provider. Try another way to log in."
              : "Something went wrong! Try other options."}
          </p>
        )}
        <Button
          disabled={isPending}
          onClick={() => {
            handleLogIn("github");
          }}
          type="submit"
          size="lg"
          className="flex w-64 gap-1 border font-medium"
        >
          {isPending && clickedProvider === "github" ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Github />
          )}
          Sign In With GitHub
        </Button>

        <Button
          disabled={isPending}
          onClick={() => {
            handleLogIn("google");
          }}
          type="submit"
          size="lg"
          className="flex w-64 min-w-48 gap-1 border font-medium"
        >
          {isPending && clickedProvider === "google" ? (
            <Loader2 className="animate-spin" />
          ) : (
            <svg
              className="h-6 w-6 fill-zinc-50 dark:fill-zinc-950"
              name="google Icon"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 50 50"
            >
              <path d="M 26 2 C 13.308594 2 3 12.308594 3 25 C 3 37.691406 13.308594 48 26 48 C 35.917969 48 41.972656 43.4375 45.125 37.78125 C 48.277344 32.125 48.675781 25.480469 47.71875 20.9375 L 47.53125 20.15625 L 46.75 20.15625 L 26 20.125 L 25 20.125 L 25 30.53125 L 36.4375 30.53125 C 34.710938 34.53125 31.195313 37.28125 26 37.28125 C 19.210938 37.28125 13.71875 31.789063 13.71875 25 C 13.71875 18.210938 19.210938 12.71875 26 12.71875 C 29.050781 12.71875 31.820313 13.847656 33.96875 15.6875 L 34.6875 16.28125 L 41.53125 9.4375 L 42.25 8.6875 L 41.5 8 C 37.414063 4.277344 31.960938 2 26 2 Z M 26 4 C 31.074219 4 35.652344 5.855469 39.28125 8.84375 L 34.46875 13.65625 C 32.089844 11.878906 29.199219 10.71875 26 10.71875 C 18.128906 10.71875 11.71875 17.128906 11.71875 25 C 11.71875 32.871094 18.128906 39.28125 26 39.28125 C 32.550781 39.28125 37.261719 35.265625 38.9375 29.8125 L 39.34375 28.53125 L 27 28.53125 L 27 22.125 L 45.84375 22.15625 C 46.507813 26.191406 46.066406 31.984375 43.375 36.8125 C 40.515625 41.9375 35.320313 46 26 46 C 14.386719 46 5 36.609375 5 25 C 5 13.390625 14.386719 4 26 4 Z"></path>
            </svg>
          )}
          Sign In With Google
        </Button>
      </div>
    </section>
  );
}
