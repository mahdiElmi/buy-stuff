"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Eraser, Filter, RotateCcw, Trash } from "lucide-react";
const subCategories = [
  { name: "Totes", href: "#" },
  { name: "Backpacks", href: "#" },
  { name: "Travel Bags", href: "#" },
  { name: "Hip Bags", href: "#" },
  { name: "Laptop Sleeves", href: "#" },
];

const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: true },
      { value: "brown", label: "Brown", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: true },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "2l", label: "2L", checked: false },
      { value: "6l", label: "6L", checked: false },
      { value: "12l", label: "12L", checked: false },
      { value: "18l", label: "18L", checked: false },
      { value: "20l", label: "20L", checked: false },
      { value: "40l", label: "40L", checked: true },
    ],
  },
];

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
  })
  .transform((obj) => {
    const newObj = { ...obj };
    if (obj.priceTo < obj.priceFrom) newObj.priceFrom = obj.priceTo;
    if (obj.ratingTo < obj.ratingFrom) newObj.ratingFrom = obj.ratingTo;
    return obj;
  });

function FilterBy({
  filters,
}: {
  filters: {
    minPrice: number;
    maxPrice: number;
    minRating: number;
    maxRating: number;
  };
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
      ratingFrom: minRating,
      ratingTo: maxRating,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push(
      `?sort=${sortParam}&price=${data.priceFrom}to${data.priceTo}&rating=${data.ratingFrom}to${data.ratingTo}`,
    );
  }

  return (
    <aside className="sticky top-[4.5rem] h-fit w-max flex-col text-nowrap break-keep rounded-md bg-zinc-200 p-2 dark:bg-zinc-900">
      <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold">
        <Filter className="h-7 w-7 rounded-md border border-zinc-300 bg-zinc-50 fill-inherit p-1 dark:border-zinc-800 dark:bg-zinc-950" />
        Filter
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-1"
        >
          <h3 className="text-xl font-semibold">Price</h3>
          <div className="flex flex-col items-start gap-1">
            <FormField
              control={form.control}
              name="priceFrom"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>From</FormLabel> */}
                  <div className="flex items-center justify-center gap-1">
                    <FormControl>
                      <Input
                        {...field}
                        className="h-8 w-24 px-2 py-1"
                        type="number"
                        placeholder="0"
                        step={0.1}
                      />
                    </FormControl>
                    <span className=" font-semibold">$</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span>to</span>
            <FormField
              control={form.control}
              name="priceTo"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>To</FormLabel> */}
                  <div className="flex items-center justify-center gap-1">
                    <FormControl>
                      <Input
                        {...field}
                        className="h-8 w-24 px-2 py-1"
                        placeholder="Infinity"
                        type="number"
                        step={0.1}
                      />
                    </FormControl>
                    <span className=" font-semibold">$</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <h3 className="text-xl font-semibold">Rating</h3>
          <div className="flex flex-row items-center gap-1">
            <FormField
              control={form.control}
              name="ratingFrom"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>From</FormLabel> */}
                  <FormControl>
                    <Input
                      {...field}
                      className="h-8 w-14 px-2 py-1"
                      type="number"
                      placeholder="0"
                      min={0}
                      max={5}
                      step={0.1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span>to</span>
            <FormField
              control={form.control}
              name="ratingTo"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>To</FormLabel> */}
                  <FormControl>
                    <Input
                      {...field}
                      className="h-8 w-14 px-2 py-1"
                      placeholder="5"
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => form.reset()}
              variant="outline"
              size="sm"
              className="mt-3"
              asChild
            >
              <Link href={`?sort=${sortParam}`}>
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
