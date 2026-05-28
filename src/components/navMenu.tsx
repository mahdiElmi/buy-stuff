"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { Category } from "@prisma/client";
import { title } from "radashi";

export default function NavMenu({ categories }: { categories: Category[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[700px] grid-cols-1 gap-4 p-6 md:w-[850px] md:grid-cols-4">
              {/* Featured Banner */}
              <NavigationMenuLink asChild>
                <Link
                  href="/products"
                  className="flex h-full min-h-[180px] flex-col justify-between rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 p-5 text-white no-underline outline-none select-none hover:from-indigo-500 hover:to-purple-600 md:col-span-1 dark:from-indigo-500 dark:to-purple-600"
                >
                  <ShoppingBag className="size-8 opacity-80" />
                  <div className="mt-4">
                    <div className="mb-1 text-lg font-bold">All Products</div>
                    <p className="text-sm leading-tight opacity-90">
                      Explore our complete catalog of stuff.
                    </p>
                  </div>
                </Link>
              </NavigationMenuLink>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:col-span-3">
                {categories.map((category) => (
                  <NavigationMenuLink key={category.id} asChild>
                    <Link
                      href={`/products/${encodeURIComponent(category.name)}`}
                      className="flex items-center rounded-md p-2.5 text-sm leading-none font-medium text-zinc-700 capitalize no-underline transition-colors outline-none select-none hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                      {title(category.name)}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
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
