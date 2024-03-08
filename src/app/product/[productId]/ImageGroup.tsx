"use client";

import Image from "next/image";
import { Image as ImageType } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumb,
  CarouselThumbNails,
} from "@/components/ui/carousel";

export default function ImageGroup({ images }: { images: ImageType[] }) {
  return (
    <Carousel className="md:w-1/2">
      <CarouselContent>
        {images.length > 0 ? (
          images.map((image) => (
            <CarouselItem key={image.url}>
              <Image
                priority={true}
                src={image.url}
                width={image.width || 700}
                height={image.height || 700}
                alt=""
                className=" aspect-square h-full w-full rounded-lg object-cover object-center"
              />
            </CarouselItem>
          ))
        ) : (
          <CarouselItem>
            <Image
              priority={true}
              src={"/questionMark.png"}
              width={500}
              height={500}
              alt=""
              className=" aspect-square h-full w-full rounded-lg object-cover object-center"
            />
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselThumbNails>
        {images.map((image, i) => (
          <CarouselThumb
            key={image.url}
            width={image.width || 100}
            height={image.height || 100}
            imgSrc={image.url}
            index={i}
          />
        ))}
        {/* <CarouselThumb
          width={100}
          height={100}
          imgSrc="https://i.imgur.com/Z9oKRVJ.jpeg"
          index={4}
        />
        <CarouselThumb
          width={100}
          height={100}
          imgSrc="https://i.imgur.com/Z9oKRVJ.jpeg"
          index={5}
        />
        <CarouselThumb
          width={100}
          height={100}
          imgSrc="https://i.imgur.com/Z9oKRVJ.jpeg"
          index={6}
        />
        <CarouselThumb
          width={100}
          height={100}
          imgSrc="https://i.imgur.com/Z9oKRVJ.jpeg"
          index={7}
        />
        <CarouselThumb
          width={100}
          height={100}
          imgSrc="https://i.imgur.com/Z9oKRVJ.jpeg"
          index={8}
        /> */}
      </CarouselThumbNails>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );

  // return (
  //   <Tab.Group as="div" className="flex flex-col-reverse">
  //     {/* Image selector */}
  //     <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
  //       <Tab.List className="grid grid-cols-4 gap-6">
  //         {images.map((image) => (
  //           <Tab
  //             key={image.id}
  //             className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
  //           >
  //             {({ selected }) => (
  //               <>
  //                 {/* <span className="sr-only">{}</span> */}
  //                 <span className="absolute inset-0 overflow-hidden rounded-md">
  //                   <Image
  //                     src={image.url}
  //                     width={image.width || 200}
  //                     height={image.height || 200}
  //                     alt=""
  //                     className=" h-full w-full object-cover object-center"
  //                   />
  //                 </span>
  //                 <span
  //                   className={cn(
  //                     selected ? "ring-indigo-500" : "ring-transparent",
  //                     "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2",
  //                   )}
  //                   aria-hidden="true"
  //                 />
  //               </>
  //             )}
  //           </Tab>
  //         ))}
  //       </Tab.List>
  //     </div>

  //     <Tab.Panels className=" aspect-square w-full">
  //       {images.map((image) => (
  //         <Tab.Panel key={image.id}>
  //           <Image
  //             priority={true}
  //             src={image.url}
  //             width={image.width || 700}
  //             height={image.height || 700}
  //             alt=""
  //             className="h-[600px] w-[600px] object-cover object-center sm:rounded-lg"
  //           />
  //         </Tab.Panel>
  //       ))}
  //     </Tab.Panels>
  //   </Tab.Group>
  // );
}
