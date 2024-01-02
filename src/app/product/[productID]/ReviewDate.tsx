"use client";

import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ComponentProps, useState } from "react";
function ReviewDate({
  date,
  ...otherProps
}: { date: Date } & ComponentProps<"button">) {
  const { className } = otherProps;
  const [dateToggle, setDateToggle] = useState(false);
  return (
    <button
      {...otherProps}
      className={cn("text-sm text-zinc-500 dark:text-zinc-600", className)}
      onClick={() => setDateToggle((prevState) => !prevState)}
    >
      {dateToggle
        ? new Intl.DateTimeFormat("en-us", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(date)
        : `${formatDistanceToNow(date)} ago`}
    </button>
  );
}

export default ReviewDate;
