"use client";

import { Button } from "@/components/ui/button";
import { Check, Clipboard } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CopyToClickBoardButton({ value }: { value: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setIsCopied(false), 1000);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return (
    <Button
      variant="outline"
      className="size-7"
      size="icon"
      onClick={handleClick}
    >
      {isCopied ? (
        <>
          <span className="sr-only">Copied to clipboard.</span>
          <Check className="size-4 text-emerald-500" />
        </>
      ) : (
        <>
          <span className="sr-only">Copy ID</span>
          <Clipboard aria-hidden="true" className="size-4" />
        </>
      )}
    </Button>
  );
}
