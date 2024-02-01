"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    // const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      // newParams.set("q", search.value);
      router.push(`?q=${search.value}`);
    } else {
      // newParams.delete("q");
    }

    // router.push(createUrl("/search", newParams));
  }

  return (
    <search className="h-full w-full">
      <form
        className="relative mx-auto flex w-1/2 min-w-fit flex-row justify-center "
        onSubmit={onSubmit}
      >
        <input
          type="text"
          name="search"
          minLength={3}
          defaultValue={searchParams?.get("q") || ""}
          placeholder="What are you looking for?"
          className="flex w-full rounded-md border-none bg-zinc-200 py-1 pe-9 text-sm font-medium shadow-inner
         placeholder:text-zinc-600 focus:ring-0 focus:placeholder:text-zinc-900 
         dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder:text-zinc-400 dark:focus:placeholder:text-zinc-300 md:text-base "
        />
        <Button
          type="submit"
          size="icon"
          variant="outline"
          className="absolute inset-y-0 right-0 flex h-8 w-8 items-center bg-zinc-300 dark:bg-zinc-950"
        >
          <MagnifyingGlassIcon
            className="h-5 w-5 flex-shrink-0 stroke-2 text-zinc-600 dark:text-zinc-400"
            aria-hidden="true"
          />
        </Button>
      </form>
    </search>
  );
}

export default SearchBar;
