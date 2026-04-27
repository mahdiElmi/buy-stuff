"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { PlugIcon, ShirtIcon } from "lucide-react";
import Link from "next/link";

export default function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink asChild>
              <Link
                href="/products"
                className="pattern-dotted relative mx-6 mt-4 flex h-full flex-col items-start justify-end overflow-clip rounded-md bg-linear-to-b from-zinc-300/50 to-zinc-300 p-6 px-4 text-xl font-black no-underline outline-hidden select-none hover:to-zinc-200 focus:shadow-md dark:from-zinc-700/50 dark:to-zinc-700 dark:hover:to-zinc-600"
              >
                All Products
              </Link>
            </NavigationMenuLink>

            <ul className="flex gap-3 p-6 md:w-[450px]">
              <li className="w-56">
                <NavigationMenuLink asChild>
                  <Link
                    className="relative flex size-full flex-col items-end justify-end overflow-clip rounded-md bg-linear-to-b from-zinc-300/50 to-zinc-300 p-6 px-4 no-underline outline-hidden select-none hover:to-zinc-200 focus:shadow-md dark:from-zinc-700/50 dark:to-zinc-700 dark:hover:to-zinc-600"
                    href="/products/clothes"
                  >
                    <ShirtIcon className="absolute inset-0 size-5/6 -translate-x-1/3 place-self-center stroke-[0.8] opacity-50" />
                    <div className="mt-4 mb-2 text-xl font-extrabold">
                      Clothes
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li className="w-56">
                <NavigationMenuLink asChild>
                  <Link
                    className="relative flex size-full flex-col items-end justify-end overflow-clip rounded-md bg-linear-to-b from-zinc-300/50 to-zinc-300 p-6 px-4 no-underline outline-hidden select-none hover:to-zinc-200 focus:shadow-md dark:from-zinc-700/50 dark:to-zinc-700 dark:hover:to-zinc-600"
                    href="/products/electronics"
                  >
                    <PlugIcon className="absolute inset-0 size-5/6 -translate-x-16 place-self-center stroke-[0.8] opacity-50" />
                    <div className="mt-4 mb-2 text-xl font-extrabold">
                      Electronics
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link href="/about">About</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link href="/blog">Blog</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
