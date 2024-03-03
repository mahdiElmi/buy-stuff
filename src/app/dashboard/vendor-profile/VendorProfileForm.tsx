"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { vendorSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Vendor } from "@prisma/client";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import updateVendorProfile from "./updateVendorProfileAction";
import { Textarea } from "@/components/ui/textarea";

export default function VendorProfileForm({ vendor }: { vendor: Vendor }) {
  const form = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),

    defaultValues: {
      name: vendor.name,
      description: vendor.description,
      image: vendor.imageURL ?? "",
      // bannerImage: vendor.bannerImage ?? "",
    },
  });

  const [isPending, startTransition] = useTransition();
  console.log(vendor);
  function handleSubmit(values: z.infer<typeof vendorSchema>) {
    startTransition(async () => {
      const result = await updateVendorProfile(values, vendor.userId);
      console.log(result);
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="group relative w-fit overflow-hidden rounded-full transition-all">
          <Image
            src={vendor.imageURL || ""}
            alt="vendor image"
            width={75}
            height={75}
          />
          <div className="absolute inset-0 hidden items-center justify-center bg-zinc-950/45 group-hover:flex">
            <Button
              type="button"
              variant="ghostHoverLess"
              size="icon"
              className="cursor-pointer"
              asChild
            >
              <Edit className="h-6 w-6 text-zinc-50" />
            </Button>
          </div>
        </div>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor Name</FormLabel>
              <FormControl>
                <Input
                  className="max-w-96"
                  type="text"
                  {...field}
                  name="vendorName"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="max-w-96" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="mt-2 w-fit"
          disabled={isPending || !form.formState.isDirty}
          type="submit"
        >
          {isPending ? "Submitting..." : "Apply Changes"}
        </Button>
      </form>
    </Form>
  );
}
