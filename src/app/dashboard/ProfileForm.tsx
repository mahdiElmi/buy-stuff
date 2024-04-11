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
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import updateProfile from "./updateProfileAction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { useUploadThing } from "@/lib/uploadthing";
import { X } from "lucide-react";

export default function ProfileForm({ user }: { user: User }) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      username: user.name,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      image: user.image,
    },
  });
  const [isPending, startTransition] = useTransition();

  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const tempImageUrl = useMemo(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      form.setValue("image", url);
      return url;
    }
    return null;
  }, [files]);
  ``;
  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader");

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles: 1,
  });

  function handleFormSubmit(values: z.infer<typeof profileSchema>) {
    startTransition(async () => {
      if (files.length > 0) {
        const uploadResult = await startUpload(files);
        if (!uploadResult) {
          toast.error("Profile update failed because image upload failed.");
          return;
        }
        form.setValue("image", uploadResult[0].url);
      }

      const result = await updateProfile(values, user.id);
      if (result?.success) {
        toast.success("Profile updated.");
        setFiles([]);
        const updatedImage = form.getValues("image");
        console.log(updatedImage);
        form.reset({ image: updatedImage });
      } else toast.error("Profile update failed.");
    });
  }

  useEffect(() => {
    return () => {
      if (tempImageUrl !== null) {
        URL.revokeObjectURL(tempImageUrl);
      }
    };
  }, [tempImageUrl]);

  const deleteTempImage = () => {
    console.log(tempImageUrl);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setFiles([]);
      form.setValue("image", user.image, { shouldDirty: true });
    } else {
      form.setValue("image", "", { shouldDirty: true });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        <FormField
          name="image"
          control={form.control}
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Image
                      className="h-20 w-20 rounded-full"
                      src={tempImageUrl ? tempImageUrl : value || "/avatar.png"}
                      alt="user profile picture"
                      width={80}
                      height={80}
                    />
                    {form.getValues("image") !== "" && (
                      <Button
                        className="absolute end-0 top-0 size-6 rounded-full"
                        variant="secondary"
                        size="icon"
                        onClick={deleteTempImage}
                        type="button"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                  <div
                    {...getRootProps()}
                    className="w-fit cursor-pointer rounded-lg border-2 border-dashed border-current p-6 opacity-70 hover:opacity-100 md:p-10"
                  >
                    <Input {...rest} {...getInputProps()} />

                    {tempImageUrl !== null
                      ? "Image Loaded."
                      : "Drop image here!"}
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
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
          disabled={
            isPending || (files.length > 0 ? false : !form.formState.isDirty)
          }
          type="submit"
        >
          {isPending ? "Submitting..." : "Apply Changes"}
        </Button>
      </form>
    </Form>
  );
}
