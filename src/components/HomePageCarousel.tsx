"use client";

import Autoplay from "embla-carousel-autoplay";
import ProductCard from "./productCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { ProductWithImagesAndVendor } from "@/lib/types";
import { Route } from "next";
import Link from "next/link";

export default function HomePageCarousel({
  products,
  headerText,
  headerLink,
}: {
  products: ProductWithImagesAndVendor[];
  headerText: string;
  headerLink: Route;
}) {
  return (
    <section className="h-fit w-full space-y-5 rounded-md bg-zinc-200 px-2 py-5 dark:bg-zinc-900 sm:px-5 ">
      <Link
        href={headerLink}
        className="text-3xl font-extrabold capitalize decoration-4 hover:underline md:text-4xl"
      >
        {headerText}
      </Link>
      <Carousel
        navButtonPosition="topRight"
        opts={{ loop: true, skipSnaps: true }}
        plugins={[Autoplay({ delay: 5000 })]}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              className=" basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
              key={product.id}
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="" />
        <CarouselNext className="" />
      </Carousel>
    </section>
  );
}
