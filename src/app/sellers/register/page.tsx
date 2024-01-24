"use client";
// name        String    @unique
// description String
// imageURL    String?
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import { RegisterAction } from "./SellerRegisterAction";
import { useTransition } from "react";
import { vendorSchema } from "@/lib/zodSchemas";
import { z } from "zod";

function page() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  function onSubmit(values: z.infer<typeof vendorSchema>) {
    startTransition(async () => {
      const result = await RegisterAction(values);
      if (result && result.cause === "invalidName") {
        console.log("Vendor Name already used. Try something else.");
      }
    });
  }
  return (
    <div>
      <h1>Welcome to the SELLER registration Process</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Volvo" {...field} />
                </FormControl>
                <FormDescription>This is your vendor name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. we make cars" {...field} />
                </FormControl>
                <FormDescription>
                  This is your vendor description. what is your shop all about?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit">
            {isPending ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default page;
