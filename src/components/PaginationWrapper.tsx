"use client";

import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./ui/pagination";
import { useSearchParams } from "next/navigation";

function PaginationWrapper({
  p,
  maxPageNum,
}: {
  p: number;
  maxPageNum: number;
}) {
  const searchParams = useSearchParams();
  let allOtherSearchParams = "";
  for (let [key, value] of searchParams.entries()) {
    if (key === "page") continue;
    allOtherSearchParams = `${allOtherSearchParams}${key}=${value}&`;
  }
  return (
    <Pagination className={cn("mt-3", maxPageNum <= 0 && "hidden")}>
      <PaginationContent>
        <PaginationItem
          className={cn(p <= 1 && "pointer-events-none opacity-60")}
        >
          <PaginationPrevious href={`?${allOtherSearchParams}page=${p - 1}`} />
        </PaginationItem>
        {p > 2 && (
          <PaginationItem>
            <PaginationLink href={`?${allOtherSearchParams}page=1`}>
              1 {p === 1 && "ass"}
            </PaginationLink>
          </PaginationItem>
        )}
        {p > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {p > 3 && (
          <PaginationItem>
            <PaginationLink href={`?${allOtherSearchParams}page=${p - 2}`}>
              {p - 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {p > 1 && (
          <PaginationItem>
            <PaginationLink href={`?${allOtherSearchParams}page=${p - 1}`}>
              {p - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href={`?${allOtherSearchParams}page=${p}`} isActive>
            {p}
          </PaginationLink>
        </PaginationItem>
        {p < maxPageNum && (
          <PaginationItem>
            <PaginationLink href={`?${allOtherSearchParams}page=${p + 1}`}>
              {p + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {p < maxPageNum - 1 && (
          <PaginationItem>
            <PaginationLink href={`?${allOtherSearchParams}page=${p + 2}`}>
              {p + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        {p < maxPageNum - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {p < maxPageNum - 2 && (
          <PaginationItem>
            <PaginationLink href={`?${allOtherSearchParams}page=${maxPageNum}`}>
              {maxPageNum}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem
          className={cn(p >= maxPageNum && " pointer-events-none opacity-60")}
        >
          <PaginationNext href={`?${allOtherSearchParams}page=${p + 1}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationWrapper;
