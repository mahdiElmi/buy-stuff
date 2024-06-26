"use client";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Route } from "next";
import { Search } from "lucide-react";

function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;

    if (search.value) {
      router.push(`/products/?q=${search.value}` as Route);
    }
  }

  return (
    <search className={cn("h-full w-full", className)}>
      <form
        className="relative mx-auto flex w-full min-w-fit flex-row justify-center sm:w-2/3 "
        onSubmit={onSubmit}
      >
        <input
          type="text"
          name="search"
          minLength={3}
          defaultValue={searchParams?.get("q") || ""}
          placeholder="Search"
          className="flex w-full rounded-md border-none bg-zinc-200 py-1 pe-9 text-base font-medium shadow-inner
         placeholder:text-zinc-600 focus:ring-0 focus:placeholder:text-zinc-900 
         dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder:text-zinc-400 dark:focus:placeholder:text-zinc-300 md:text-base "
        />
        <Button
          type="submit"
          size="icon"
          variant="outline"
          className="absolute inset-y-0 right-0 flex h-8 w-8 items-center bg-zinc-300 dark:bg-zinc-950"
        >
          <Search
            className="h-5 w-5 flex-shrink-0 stroke-2 text-zinc-600 dark:text-zinc-400"
            aria-hidden="true"
          />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    </search>
  );
}

export default SearchBar;
