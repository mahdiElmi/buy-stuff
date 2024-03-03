"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Edit, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import updateProfile from "./updateProfileAction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function ProfileForm({ user }: { user: User }) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      username: user.name,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    },
  });

  const [isPending, startTransition] = useTransition();

  function handleSubmit(values: z.infer<typeof profileSchema>) {
    console.log("hello?");
    startTransition(async () => {
      const result = await updateProfile(values, user.id);
      console.log(result);
      if (result?.success) toast.success("Profile updated.");
      else toast.error("Profile update failed.");
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
            src={user.image}
            alt="user profile picture"
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
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input className="max-w-96" type="text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input className="max-w-96" type="text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input className="max-w-96" type="text" {...field} />
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

export default ProfileForm;
