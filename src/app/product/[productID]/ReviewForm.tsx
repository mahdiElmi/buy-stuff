"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReviewSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import Image from "next/image";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitReview from "./ReviewFormAction";
import { LucideRotateCw } from "lucide-react";
import CustomRating from "@/components/ui/CustomRating";
import { toast } from "sonner";

function ReviewForm({ user, productId }: { user: User; productId: string }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      body: "",
    },
  });
  function onSubmit(values: z.infer<typeof ReviewSchema>) {
    console.log(values);
    startTransition(async () => {
      const result = await SubmitReview(values, user.id, productId);
      if (result.success) {
        form.reset();
      } else {
        toast.error("Something went wrong!");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col gap-4 py-12 ${
          isPending ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <Image
            width={36}
            height={36}
            src={user.image}
            alt={user.name}
            className="h-9 w-9 rounded-full"
          />
          <h3 className="">{user.name}</h3>
          {/* #TODO starInput */}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-3">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Title</FormLabel>

                  <FormControl>
                    <Input className="" placeholder="Review Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="rating"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <CustomRating
                      color="gold"
                      isRequired
                      orientation="horizontal"
                      className="max-w-40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="body"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review</FormLabel>

                <FormControl>
                  <Textarea
                    rows={4}
                    className=""
                    placeholder="Review away!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={isPending}
          className="mt-4 w-fit self-center rounded-lg p-1 px-3 text-lg font-bold"
        >
          {isPending ? <LucideRotateCw className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

export default ReviewForm;
