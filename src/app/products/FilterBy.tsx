"use client";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// ✅ SIMPLIFIED SCHEMA: Strictly numbers, matching the Slider component's output
const FormSchema = z.object({
  price: z.tuple([z.number(), z.number()]),
  rating: z.tuple([z.number(), z.number()]),
});

function FilterBy({
  filters,
  className,
}: {
  filters: {
    minPrice: number;
    maxPrice: number;
    minRating: number;
    maxRating: number;
  };
  className?: string;
}) {
  const { minPrice, maxPrice, minRating, maxRating } = filters;
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort") ?? "new";
  const searchQueryParam = searchParams.get("q")
    ? `&q=${searchParams.get("q")}`
    : "";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      price: [minPrice, maxPrice],
      rating: [minRating, maxRating],
    },
  });

  const isRestedDisabled =
    searchParams.get("rating") === null && searchParams.get("price") === null;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // ✅ FIX: Handle inverted slider ranges safely here instead of in Zod
    const p0 = Math.min(data.price[0], data.price[1]);
    const p1 = Math.max(data.price[0], data.price[1]);
    const r0 = Math.min(data.rating[0], data.rating[1]);
    const r1 = Math.max(data.rating[0], data.rating[1]);

    router.push(
      `?sort=${sortParam}&price=${p0}to${p1}&rating=${r0}to${r1}${searchQueryParam}`,
      { scroll: true },
    );
  }

  const resetAndClearParams = () => {
    form.reset({
      price: [minPrice, maxPrice],
      rating: [minRating, maxRating],
    });
  };

  return (
    <aside
      className={cn(
        "bg-muted/30 flex h-fit w-full rounded-md p-2 text-nowrap break-keep lg:sticky lg:top-16 lg:w-max lg:flex-col",
        className,
      )}
    >
      {/* MOBILE DRAWER */}
      <Drawer>
        <DrawerTrigger className="flex items-center gap-2 text-xl font-bold lg:hidden lg:text-2xl">
          <Filter className="size-6 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 lg:h-7 lg:w-7 dark:border-zinc-800 dark:bg-zinc-950" />
          <h2>Filter</h2>
          <ChevronDown className="size-4" />
        </DrawerTrigger>
        <DrawerContent className="px-5">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
              <Filter className="size-7 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
              <h2>Filter</h2>
            </DrawerTitle>
          </DrawerHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="price"
                render={({ field: { value, onChange } }) => (
                  <FormItem className="w-full">
                    <FormLabel asChild className="text-xl font-semibold">
                      <h3>Price</h3>
                    </FormLabel>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {formatPrice(value[0])}
                      </span>
                      <span className="text-sm font-medium">
                        {formatPrice(value[1])}
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        value={value}
                        onValueChange={onChange}
                        min={minPrice}
                        max={maxPrice}
                        step={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field: { value, onChange } }) => (
                  <FormItem className="w-full">
                    <FormLabel asChild className="text-xl font-semibold">
                      <h3>Rating</h3>
                    </FormLabel>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{value[0]}</span>
                      <span className="text-sm font-medium">{value[1]}</span>
                    </div>
                    <FormControl>
                      <Slider
                        value={value}
                        onValueChange={onChange}
                        min={minRating}
                        max={maxRating}
                        step={0.1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DrawerFooter>
            <div className="ms-auto flex gap-2">
              <DrawerClose asChild>
                <Button
                  onClick={resetAndClearParams}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  asChild
                >
                  <Link
                    href={`?sort=${sortParam}${searchQueryParam}`}
                    className={cn(
                      isRestedDisabled && "pointer-events-none opacity-50",
                    )}
                  >
                    <RotateCcw className="me-1 size-4" /> Reset
                  </Link>
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button
                  type="submit"
                  size="sm"
                  className="mt-3"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Apply
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* DESKTOP SIDEBAR */}
      <div className="mb-3 hidden items-center gap-2 text-2xl font-bold lg:flex">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Filter className="size-7 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
          Filter
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="hidden w-full flex-col gap-5 lg:flex"
        >
          <FormField
            control={form.control}
            name="price"
            render={({ field: { value, onChange } }) => (
              <FormItem className="w-full">
                <FormLabel asChild className="text-xl font-semibold">
                  <h3>Price</h3>
                </FormLabel>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    {formatPrice(value[0])}
                  </span>
                  <span className="text-sm font-medium">
                    {formatPrice(value[1])}
                  </span>
                </div>
                <FormControl>
                  <Slider
                    value={value}
                    onValueChange={onChange}
                    min={minPrice}
                    max={maxPrice}
                    step={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field: { value, onChange } }) => (
              <FormItem className="w-full">
                <FormLabel asChild className="text-xl font-semibold">
                  <h3>Rating</h3>
                </FormLabel>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{value[0]}</span>
                  <span className="text-sm font-medium">{value[1]}</span>
                </div>
                <FormControl>
                  <Slider
                    value={value}
                    onValueChange={onChange}
                    min={minRating}
                    max={maxRating}
                    step={0.1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              onClick={resetAndClearParams}
              variant="outline"
              size="sm"
              className="mt-3"
              asChild
            >
              <Link
                href={`?sort=${sortParam}${searchQueryParam}`}
                className={cn(
                  isRestedDisabled && "pointer-events-none opacity-50",
                )}
              >
                <RotateCcw className="me-1 size-4" /> Reset
              </Link>
            </Button>
            <Button type="submit" size="sm" className="mt-3">
              Apply
            </Button>
          </div>
        </form>
      </Form>
    </aside>
  );
}

export default FilterBy;
