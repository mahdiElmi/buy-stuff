"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, RotateCcw, Trash } from "lucide-react";

import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const FormSchema = z
  .object({
    priceFrom: z
      .string()
      .transform((val) => {
        let num = parseFloat(val);
        if (num <= 0 || isNaN(num)) num = 0;
        return num;
      })
      .or(z.number()),
    priceTo: z
      .string()
      .transform((val) => {
        let num = parseFloat(val);
        if (num <= 0 || isNaN(num)) num = Infinity;
        return num;
      })
      .or(z.number()),
    ratingFrom: z
      .string()
      .transform((val) => {
        let num = parseFloat(val);
        if (num <= 0 || isNaN(num)) num = 0;
        return num;
      })
      .or(z.number()),
    ratingTo: z
      .string()
      .transform((val) => {
        let num = parseFloat(val);
        if (num <= 0 || isNaN(num)) num = 5;
        return num;
      })
      .or(z.number()),
    price: z.tuple([
      z
        .string()
        .transform((val) => {
          let num = parseFloat(val);
          if (num <= 0 || isNaN(num)) num = 0;
          return num;
        })
        .or(z.number()),
      z
        .string()
        .transform((val) => {
          let num = parseFloat(val);
          if (num <= 0 || isNaN(num)) num = Infinity;
          return num;
        })
        .or(z.number()),
    ]),
    rating: z.tuple([
      z
        .string()
        .transform((val) => {
          let num = parseFloat(val);
          if (num <= 0 || isNaN(num)) num = 0;
          return num;
        })
        .or(z.number()),
      z
        .string()
        .transform((val) => {
          let num = parseFloat(val);
          if (num <= 0 || isNaN(num)) num = 5;
          return num;
        })
        .or(z.number()),
    ]),
  })
  .transform((obj) => {
    const newObj = { ...obj };
    if (obj.priceTo < obj.priceFrom) newObj.priceFrom = obj.priceTo;
    if (obj.ratingTo < obj.ratingFrom) newObj.ratingFrom = obj.ratingTo;
    return obj;
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      priceFrom: minPrice,
      priceTo: maxPrice,
      price: [minPrice, maxPrice],
      rating: [minRating, maxRating],
      ratingFrom: minRating,
      ratingTo: maxRating,
    },
  });

  let isRestedDisabled = false;
  if (searchParams.get("rating") === null && searchParams.get("price") === null)
    isRestedDisabled = true;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push(
      `?sort=${sortParam}&price=${data.price[0]}to${data.price[1]}&rating=${data.rating[0]}to${data.rating[1]}`,
    );
  }

  return (
    <aside
      className={cn(
        "flex h-fit w-full text-nowrap break-keep rounded-md bg-zinc-200 p-2 dark:bg-zinc-900 lg:sticky lg:top-[4.5rem] lg:w-max lg:flex-col",
        className,
      )}
    >
      <Drawer>
        <DrawerTrigger className="flex items-center gap-2 text-xl font-bold lg:hidden lg:text-2xl">
          <Filter className="h-6 w-6 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950 lg:h-7 lg:w-7" />
          <h2>Filter</h2>
          <ChevronDown className=" h-4 w-4" />
        </DrawerTrigger>
        <DrawerContent className="px-5">
          <DrawerHeader>
            <DrawerTitle className=" flex items-center justify-center gap-2 text-2xl font-bold">
              <Filter className="h-7 w-7 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
              <h2>Filter</h2>
            </DrawerTitle>
          </DrawerHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full items-stretch justify-stretch gap-4 lg:flex-col lg:gap-5"
            >
              <FormField
                control={form.control}
                name="price"
                render={({ field: { onChange, ...fields } }) => (
                  <FormItem className="w-full">
                    <FormLabel asChild className="text-xl font-semibold">
                      <h3>Price</h3>
                    </FormLabel>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {fields.value[0].toLocaleString()}$
                      </span>
                      <span className="text-sm font-medium">
                        {fields.value[1].toLocaleString()}$
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        {...fields}
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

              <div className="hidden gap-2 lg:flex">
                <Button
                  onClick={() => form.reset()}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  asChild
                >
                  <Link
                    href={`?sort=${sortParam}`}
                    className={cn(
                      isRestedDisabled && "pointer-events-none opacity-50",
                    )}
                  >
                    <RotateCcw className="me-1 h-4 w-4" /> Reset
                  </Link>
                </Button>
                <Button type="submit" size="sm" className="mt-3">
                  Apply
                </Button>
              </div>
            </form>
          </Form>
          <DrawerFooter>
            <div className="ms-auto flex gap-2 lg:hidden">
              <DrawerClose
                className={cn(isRestedDisabled && "pointer-events-none")}
              >
                <Button
                  onClick={() => form.reset()}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  asChild
                >
                  <Link
                    href={`?sort=${sortParam}`}
                    className={cn(
                      isRestedDisabled && "pointer-events-none opacity-50",
                    )}
                  >
                    <RotateCcw className="me-1 h-4 w-4" /> Reset
                  </Link>
                </Button>
              </DrawerClose>
              <Button type="submit" size="sm" className="mt-3">
                Apply
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <div className="mb-3 hidden items-center gap-2 text-2xl font-bold lg:flex">
        <h2 className=" flex items-center gap-2 text-2xl font-bold">
          <Filter className="h-7 w-7 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
          Filter
        </h2>
        <div className="ms-auto flex gap-2 lg:hidden">
          <Button
            onClick={() => form.reset()}
            variant="outline"
            size="sm"
            className="mt-3"
            asChild
          >
            <Link
              href={`?sort=${sortParam}`}
              className={cn(
                isRestedDisabled && "pointer-events-none opacity-50",
              )}
            >
              <RotateCcw className="me-1 h-4 w-4" /> Reset
            </Link>
          </Button>
          <Button type="submit" size="sm" className="mt-3">
            Apply
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="hidden w-full items-stretch justify-stretch gap-4 lg:flex lg:flex-col lg:gap-5"
        >
          <FormField
            control={form.control}
            name="price"
            render={({ field: { onChange, ...fields } }) => (
              <FormItem className="w-full">
                <FormLabel asChild className="text-xl font-semibold">
                  <h3>Price</h3>
                </FormLabel>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    {fields.value[0].toLocaleString()}$
                  </span>
                  <span className="text-sm font-medium">
                    {fields.value[1].toLocaleString()}$
                  </span>
                </div>
                <FormControl>
                  <Slider
                    {...fields}
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

          <div className="hidden gap-2 lg:flex">
            <Button
              onClick={() => form.reset()}
              variant="outline"
              size="sm"
              className="mt-3"
              asChild
            >
              <Link
                href={`?sort=${sortParam}`}
                className={cn(
                  isRestedDisabled && "pointer-events-none opacity-50",
                )}
              >
                <RotateCcw className="me-1 h-4 w-4" /> Reset
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
