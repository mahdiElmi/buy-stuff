"use client";
import { useTransition } from "react";
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
import { UploadButton, UploadDropzone, Uploader } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
// export interface ProductData {
//   name: string;
//   description: string;
//   categories: string;
//   price: string;
//   stock: string;
//   imgUrls: string[];
// }

export default function Add() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categories: "",
      price: 0,
      stock: 1,
      imgUrls: [],
    },
  });
  const productData = form.watch();
  // const [productData, setProductData] = useState<ProductData>({
  //   name: "",
  //   description: "",
  //   categories: "",
  //   price: "",
  //   stock: "",
  //   imgUrls: [],
  // });
  // console.log(productData);

  // function handleChange(
  //   e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  // ) {
  //   const { name, value } = e.currentTarget;
  //   console.log("bruh", name, value, typeof value);
  //   setProductData((oldData) => ({ ...oldData, [name]: value }));
  // }
  function onSubmit(values: z.infer<typeof productSchema>) {
    startTransition(async () => {
      const result = await addProduct(values);
      console.log(result);
    });
  }
  return (
    <div>
      <Form {...form}>
        <form
          className="grid max-w-4xl grid-cols-2 gap-5 py-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-5">
            <FormField
              // className="rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  {/* <FormDescription>assdunk</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              // className="rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"
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
                  {/* <FormDescription>assdunk</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              // className="rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"
              name="categories"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose Categories" {...field} />
                  </FormControl>
                  {/* <FormDescription>assdunk</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row items-center space-x-3 ">
              <FormField
                // className="min-w-[4rem] max-w-full rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"
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
                    {/* <FormDescription>a  ssdunk</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // className="min-w-[4rem] max-w-full rounded-lg border-0 bg-zinc-100 p-2 font-medium shadow-inner dark:bg-zinc-800"

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
                    {/* <FormDescription>assdunk</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Image Upload</FormLabel>
              <FormControl>
                <UploadDropzone
                  className="border-4 border-dotted border-zinc-300 dark:border-zinc-700"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const urls: [string, ...string[]] = [
                      res[0].url,
                      ...res.map((fileObj) => {
                        return fileObj.url;
                      }),
                    ];
                    form.setValue("imgUrls", urls);
                    console.log("Files: ", res);
                    toast({
                      description:
                        urls.length > 1
                          ? `${urls.length} Images successfully uploaded.`
                          : "Image upload completed.",
                    });
                  }}
                  onUploadError={(error) => {
                    toast({
                      title: "Upload Failed",
                      description: `cause: ${error.cause}`,
                      variant: "destructive",
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          {/* <div className="flex h-full w-full"> */}
          <DummyProductItem product={productData} />
          {/* </div> */}
          <Button
            variant="default"
            className="col-span-full m-auto"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Create new Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
