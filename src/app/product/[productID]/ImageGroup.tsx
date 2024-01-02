"use client";
import { Tab } from "@headlessui/react";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Image as ImageType } from "@prisma/client";

export default function ImageGroup({ images }: { images: ImageType[] }) {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      {/* Image selector */}
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <Tab
              key={image.id}
              className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
            >
              {({ selected }) => (
                <>
                  {/* <span className="sr-only">{}</span> */}
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <Image
                      src={image.url}
                      width={image.width || 200}
                      height={image.height || 200}
                      alt=""
                      className=" h-full w-full object-cover object-center"
                    />
                  </span>
                  <span
                    className={cn(
                      selected ? "ring-indigo-500" : "ring-transparent",
                      "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2",
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
        {images.map((image) => (
          <Tab.Panel key={image.id}>
            <Image
              src={image.url}
              width={image.width || 700}
              height={image.height || 700}
              alt=""
              className="h-[600px] w-[600px] object-cover object-center sm:rounded-lg"
            />
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
