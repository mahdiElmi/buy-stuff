import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchBar() {
  return (
    <div className="relative mx-auto flex w-1/2 min-w-fit flex-row justify-center">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon
          className="h-5 w-5 flex-shrink-0 text-zinc-400"
          aria-hidden="true"
        />
      </div>
      <input
        type="text"
        placeholder="What are you looking for?"
        className="placeholder:tex-base flex w-full rounded-lg border-none bg-white pr-3 ps-10 font-medium shadow-inner
         placeholder:text-zinc-400 focus:bg-white focus:text-zinc-900 focus:ring-0 focus:placeholder:text-zinc-500 dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder:text-zinc-400 dark:focus:placeholder:text-zinc-300 sm:text-sm sm:leading-6 "
      />
    </div>
  );
}

export default SearchBar;
