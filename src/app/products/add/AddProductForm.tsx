"use client";
import { useEffect, useMemo, useTransition } from "react";
import DummyProductItem from "./DummyProductItem";
import { addProduct } from "@/actions/addProductAction";
import { useForm } from "react-hook-form";
import { productSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { Trash, X } from "lucide-react";

export default function AddProductForm({
  categories,
}: {
  categories: Category[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 1,
      imgUrls: [],
    },
  });
  const productData = form.watch();

  function onSubmit(values: z.infer<typeof productSchema>) {
    startTransition(async () => {
      const result = await addProduct(values);
      console.log(result);
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid max-w-4xl grid-cols-2 gap-2 px-5 py-6 md:gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-full flex flex-col gap-5 md:col-span-1">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Product description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="categories"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          className="capitalize"
                          value={category.name}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row items-center space-x-3 ">
            <FormField
              name="stock"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={1}
                      min={1}
                      placeholder="Qty"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center justify-center gap-2">
                      <Input
                        type="number"
                        step={0.01}
                        min={0}
                        placeholder="Price"
                        {...field}
                      />
                      <span className=" mb-2 cursor-default select-none self-end text-lg font-medium">
                        $
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormItem>
            <FormLabel>Image Upload</FormLabel>
            <FormControl>
              <div className="relative">
                {/* {productData.imgUrls.length >= 5 && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md font-medium backdrop-blur-sm ">
                    You can&apos;t upload more than 5 images.
                  </div>
                )} */}
                <UploadDropzone
                  className={cn(
                    "border-4 border-dotted border-zinc-300 dark:border-zinc-700",
                    productData.imgUrls.length >= 5 && " opacity-40 ",
                  )}
                  onBeforeUploadBegin={(files) => {
                    if (productData.imgUrls.length + files.length > 5) {
                      toast.error("File limit reached.", {
                        description: "Can't upload more than 5 images.",
                      });
                      return [];
                    }
                    return files;
                  }}
                  config={{ mode: "auto" }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const urls = res.map((fileObj) => {
                      return fileObj.url;
                    });
                    form.setValue("imgUrls", [...urls, ...productData.imgUrls]);
                    console.log("Files: ", res);
                    if (urls.length > 0)
                      toast(
                        urls.length > 1
                          ? `${urls.length} Images successfully uploaded.`
                          : "Image upload completed.",
                      );
                  }}
                  onUploadError={(error) => {
                    console.log(error);
                    error.message;
                    toast.error("Upload Failed", {
                      description: error.message,
                    });
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
          <Reorder.Group
            className="mt-5 flex flex-row gap-3"
            axis="x"
            values={productData.imgUrls}
            onReorder={(newOrder) => form.setValue("imgUrls", newOrder)}
          >
            {productData.imgUrls.map((imgUrl, i) => (
              <Reorder.Item key={imgUrl} value={imgUrl}>
                <label className="group relative ">
                  <span
                    className={cn(
                      " absolute hidden w-full -translate-y-5 text-center text-xs font-medium sm:-translate-y-6 sm:text-sm ",
                      i === 0 && "block",
                    )}
                  >
                    Thumbnail
                  </span>
                  <div className="">
                    <span className="sr-only">Delete product</span>
                    <Button
                      className="absolute right-[2px] top-[2px] h-6 w-6 cursor-pointer p-[2px]"
                      asChild
                      variant="outline"
                      title="Edit Product"
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </div>
                  <Image
                    draggable="false"
                    className="aspect-square rounded-md object-cover object-center shadow-lg hover:cursor-grab active:cursor-grabbing"
                    width={150}
                    height={150}
                    src={imgUrl}
                    alt=""
                  />
                </label>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        <DummyProductItem
          className="col-span-full md:col-span-1"
          product={productData}
        />
        <Button
          variant="default"
          className="col-span-3 m-auto mt-5 text-lg font-bold"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Create new Product"}
        </Button>
      </form>
    </Form>
  );
}
