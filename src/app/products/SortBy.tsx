"use client";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ArrowDown10,
  ArrowDownWideNarrow,
  ArrowUp10,
  ArrowUpDown,
  ArrowUpWideNarrow,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";

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
  className,
}: {
  currentSort: "new" | "old" | "price-to-low" | "price-to-high" | "rating";
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  let allOtherSearchParams = "";
  for (let [key, value] of searchParams.entries()) {
    if (key === "sort") continue;
    allOtherSearchParams = `${allOtherSearchParams}${key}=${value}&`;
  }

  function handleSelectValueChange(value: string) {
    router.push(`?${allOtherSearchParams}sort=${value}`);
  }

  return (
    <aside
      className={cn(
        "flex h-fit w-fit items-end gap-10 text-nowrap break-keep rounded-md bg-zinc-200 dark:bg-zinc-900 lg:sticky lg:top-[4.5rem] lg:flex-col lg:items-start lg:gap-0 lg:p-2",
        className,
      )}
    >
      <h2 className="mb-1 flex items-start gap-2 text-xl font-bold lg:text-2xl">
        <ArrowUpDown className=" h-6 w-6 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950 lg:h-7 lg:w-7" />
        Sort
      </h2>
      <div className="hidden lg:block">
        {sortOptions.map((sortOption) => (
          <Link
            key={sortOption.name}
            className={cn(
              "flex items-center gap-1 font-semibold decoration-2 underline-offset-2 hover:underline",
              { "text-blue-500": currentSort === sortOption.hrefParam },
            )}
            href={`?${allOtherSearchParams}sort=${sortOption.hrefParam}`}
          >
            {sortOption.Icon}
            {sortOption.name}
          </Link>
        ))}
      </div>
      <Select value={currentSort} onValueChange={handleSelectValueChange}>
        <SelectTrigger className="w-fit lg:hidden ">
          <SelectValue placeholder="Min Price" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((sortOption) => (
            <SelectItem value={sortOption.hrefParam} key={sortOption.name}>
              <div className="flex flex-row items-center gap-1 font-semibold">
                {sortOption.Icon}
                {sortOption.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </aside>
  );
}

export default SortBy;
