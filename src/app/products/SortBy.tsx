"use client";
import { cn } from "@/lib/utils";
import {
  ArrowDown10,
  ArrowDownWideNarrow,
  ArrowUp10,
  ArrowUpDown,
  ArrowUpWideNarrow,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const sortOptions = [
  {
    name: "Highest Rated",
    hrefParam: "rating",
    Icon: (
      <Star className="h-6 w-6 rounded-md border border-zinc-300 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950" />
    ),
  },
  {
    name: "New",
    hrefParam: "new",
    Icon: (
      <ArrowUpWideNarrow className="h-6 w-6 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
    ),
  },
  {
    name: "Old",
    hrefParam: "old",
    Icon: (
      <ArrowDownWideNarrow className="h-6 w-6 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
    ),
  },
  {
    name: "Price: Low to High",
    hrefParam: "price-to-high",
    Icon: (
      <ArrowUp10 className=" h-6 w-6 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
    ),
  },
  {
    name: "Price: High to Low",
    hrefParam: "price-to-low",
    Icon: (
      <ArrowDown10 className=" h-6 w-6 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
    ),
  },
] as const;

function SortBy({
  currentSort,
}: {
  currentSort: "new" | "old" | "price-to-low" | "price-to-high" | "rating";
}) {
  const searchParams = useSearchParams();
  let allOtherSearchParams = "";
  for (let [key, value] of searchParams.entries()) {
    if (key === "sort") continue;
    allOtherSearchParams = `${allOtherSearchParams}${key}=${value}&`;
  }

  return (
    <aside className="sticky top-[4.5rem] flex h-fit w-max flex-col text-nowrap break-keep rounded-md bg-zinc-200 p-2 dark:bg-zinc-900">
      <h2 className="mb-1 flex gap-2 text-2xl font-bold">
        <ArrowUpDown className=" h-7 w-7 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
        Sort
      </h2>
      {sortOptions.map((sortOption) => (
        <Link
          key={sortOption.name}
          className={cn(
            "flex items-center gap-1 font-semibold decoration-2 underline-offset-2 hover:underline",
            { "text-blue-500": currentSort === sortOption.hrefParam },
          )}
          href={`?${allOtherSearchParams}sort=${sortOption.hrefParam}`}
        >
          {sortOption.Icon && sortOption.Icon}
          {sortOption.name}
        </Link>
      ))}
    </aside>
  );
}

export default SortBy;
