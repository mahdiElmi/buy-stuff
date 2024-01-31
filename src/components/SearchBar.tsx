import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchBar() {
  return (
    <search className="relative mx-auto flex w-1/2 min-w-fit flex-row justify-center ">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
        <MagnifyingGlassIcon
          className="h-5 w-5 flex-shrink-0 stroke-2 text-zinc-600 dark:text-zinc-400"
          aria-hidden="true"
        />
      </div>
      <input
        type="text"
        placeholder="What are you looking for?"
        className="flex w-full rounded-md border-none bg-zinc-200 py-1 pe-3 ps-8 text-sm font-medium shadow-inner
         placeholder:text-zinc-600 focus:ring-0 focus:placeholder:text-zinc-900 
         dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder:text-zinc-400 dark:focus:placeholder:text-zinc-300 md:text-base "
      />
    </search>
  );
}

export default SearchBar;
