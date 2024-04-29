"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { shippingAddressSchema } from "@/lib/zodSchemas";
import { Prisma } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  addShippingAddress,
  changeDefaultAddress,
  deleteShippingAddress,
  updateShippingAddress,
} from "./updateProfileAction";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const userWithShippingAddress = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    shippingAddresses: true,
  },
});

export type UserWithShippingAddress = Prisma.UserGetPayload<
  typeof userWithShippingAddress
>;

const defaultValues = {
  id: "",
  firstName: "",
  lastName: "",
  country: "",
  state: "",
  city: "",
  address: "",
  zip: "",
  phoneNumber: "",
} as const;

export default function ShippingAddresses({
  user,
}: {
  user: UserWithShippingAddress;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    mode: "onBlur",
    defaultValues,
  });
  const [open, setOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(
    user.defaultShippingAddressId,
  );

  const [isPending, startTransition] = useTransition();
  const [isPendingDefaultChange, startDefaultChangeTransition] =
    useTransition();

  function handleFormSubmit(values: z.infer<typeof shippingAddressSchema>) {
    console.log("it's happening");
    startTransition(async () => {
      if (values.id) {
        const result = await updateShippingAddress(values, user.id);
        if (result.success) {
          setOpen(false);
          toast.success("Profile updated.");
          router.push("/dashboard");
          form.reset();
        } else
          toast.error("Profile update failed.", { description: result.cause });
      } else {
        const result = await addShippingAddress(values, user.id);
        if (result.success) {
          setOpen(false);
          toast.success("Profile updated.");
          router.push("/dashboard");
          form.reset();
        } else
          toast.error("Profile update failed.", { description: result.cause });
      }
    });
  }

  function handleDefaultAddressChange(newDefaultAddressId: string) {
    setDefaultAddress(newDefaultAddressId);
    startDefaultChangeTransition(async () => {
      await changeDefaultAddress(user.id, newDefaultAddressId);
    });
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <RadioGroup
        className="flex-col gap-4"
        onValueChange={handleDefaultAddressChange}
        defaultValue={defaultAddress ?? undefined}
        value={defaultAddress ?? undefined}
      >
        {user.shippingAddresses.map((address) => (
          <Button
            key={address.id}
            asChild
            variant="ghostHoverLess"
            className={cn(
              "relative flex h-36 max-w-[350px] flex-col items-start justify-start rounded-md border-2 border-zinc-500 p-3 px-4 text-xl font-bold opacity-75 hover:cursor-pointer hover:opacity-100",
              defaultAddress === address.id &&
                "border-orange-600 opacity-100 dark:border-orange-900",
            )}
          >
            <Label htmlFor={address.id}>
              <div className="absolute end-4 top-3 flex gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="size-7 p-1"
                      variant="ghost"
                      title="Edit Address"
                      onClick={(e) => {
                        e.stopPropagation();
                        form.reset({ ...address });
                      }}
                    >
                      <Edit />
                      <span className="sr-only">Edit Address</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Address Info</DialogTitle>
                      <DialogDescription>
                        Fill out your address info. Click save when you&apos;re
                        done.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        className="grid grid-cols-2 gap-5"
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                      >
                        <div className="flex flex-col gap-3">
                          <FormField
                            name="firstName"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    className="max-w-96"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
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
                                  <Input
                                    className="max-w-96"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="country"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input
                                    className="max-w-96"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="state"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input
                                    className="max-w-96"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <FormField
                            name="city"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input
                                    className="max-w-96"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="address"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input
                                    className="max-w-96"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="zip"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Zip</FormLabel>
                                <FormControl>
                                  <Input
                                    className="max-w-96"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="phoneNumber"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    className="max-w-96"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          className="col-span-full m-auto mt-2 w-fit"
                          disabled={isPending || !form.formState.isDirty}
                          type="submit"
                        >
                          {isPending ? "Submitting..." : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                <DeleteAddressButton addressId={address.id} userId={user.id} />
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem
                  className={cn(
                    defaultAddress === address.id &&
                      "text-orange-600 dark:text-orange-900",
                  )}
                  value={address.id}
                  id={address.id}
                />
                <h3 className="text-lg font-medium capitalize">
                  {address.firstName} {address.lastName}
                </h3>
              </div>
              <ul className="grid list-inside list-disc grid-cols-2 *:text-base *:font-normal *:before:-ms-2 *:before:content-['']">
                <li>{address.country}</li>
                <li>{address.state}</li>
                <li>{address.city}</li>
                <li>{address.phoneNumber}</li>
              </ul>
              <p className="my-auto w-full overflow-clip text-ellipsis text-base font-medium">
                {address.address}
              </p>
            </Label>
          </Button>
        ))}
      </RadioGroup>

      {user.shippingAddresses.length < 3 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghostHoverLess"
              onClick={() => form.reset(defaultValues)}
              className="flex h-36 max-w-[350px] items-center justify-center rounded-md border-2 border-dashed border-zinc-500 px-10 text-xl font-bold opacity-75 hover:cursor-pointer hover:opacity-100"
            >
              Add shipping address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Address Info</DialogTitle>
              <DialogDescription>
                Fill out your address info. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                className="grid grid-cols-2 gap-5"
                onSubmit={form.handleSubmit(handleFormSubmit)}
              >
                <div className="flex flex-col gap-3">
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
                  <FormField
                    name="country"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input className="max-w-96" type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input className="max-w-96" type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <FormField
                    name="city"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input className="max-w-96" type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input className="max-w-96" type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="zip"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip</FormLabel>
                        <FormControl>
                          <Input className="max-w-96" type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="phoneNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input className="max-w-96" type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  className="col-span-full m-auto mt-2 w-fit"
                  disabled={isPending || !form.formState.isDirty}
                  type="submit"
                >
                  {isPending ? "Submitting..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function DeleteAddressButton({
  addressId,
  userId,
}: {
  addressId: string;
  userId: string;
}) {
  const [isPendingDelete, startDeleteTransition] = useTransition();

  function handleDelete(id: string) {
    startDeleteTransition(async () => {
      const result = await deleteShippingAddress(userId, id);
      if (!result.success) toast.error("Address Delete failed.");
    });
  }

  return (
    <Button
      className="size-7 p-1"
      variant="ghost"
      title="Delete Address"
      disabled={isPendingDelete}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleDelete(addressId);
      }}
    >
      {isPendingDelete ? <Loader className="animate-spin" /> : <Trash2 />}
      <span className="sr-only">Delete Address</span>
    </Button>
  );
}
