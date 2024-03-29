"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ReviewSort({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const router = useRouter();

  function handleChange(value: string) {
    router.push(`?sort=${value}`, { scroll: false });
  }
  return (
    <div className={cn("flex items-center gap-2", className)}>
      Sort reviews by:
      <Select onValueChange={handleChange}>
        <SelectTrigger
          defaultValue="new"
          value={value}
          className="w-20 rounded-md border-0 bg-transparent font-medium text-current dark:bg-transparent"
        >
          <SelectValue placeholder="New" />
        </SelectTrigger>
        <SelectContent className="font-medium">
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="top">Top</SelectItem>
          <SelectItem value="old">Old</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
