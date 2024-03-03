"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { UserWithShoppingCartAndVendor } from "@/lib/types";
import { usePathname } from "next/navigation";

export default function DashNav({
  user,
}: {
  user: UserWithShoppingCartAndVendor;
}) {
  const path = usePathname();
  return (
    path.includes("dashboard") && (
      <nav className="flex h-fit w-full flex-col items-start  gap-2 ">
        <h2 className=" text-2xl font-black">Dashboard</h2>
        {/* <Separator className="w-5/6 " /> */}
        <Button
          asChild
          className=" flex w-full justify-start text-start text-xl font-bold"
          variant="ghost"
        >
          <Link href="/dashboard">Profile</Link>
        </Button>
        <Button
          asChild
          className=" flex w-full justify-start text-start text-xl font-bold"
          variant="ghost"
        >
          <Link href="/dashboard/favorites">Favorites</Link>
        </Button>
        {/* <Button
          asChild
          className=" flex w-full justify-start text-start text-xl font-bold"
          variant="ghost"
        >
          <Link href="/dashboard/purchase-history">Purchase History</Link>
        </Button> */}
        {/* <Button
          asChild
          className=" flex w-full justify-start text-start text-xl font-bold"
          variant="ghost"
        >
          <Link href="/dashboard/lists">Lists</Link>
        </Button> */}
        {user.vendor && (
          <>
            <h2 className="  text-2xl font-black text-emerald-500">
              Sell Stuff
            </h2>
            {/* <Separator className="w-5/6 " /> */}
            <Button
              asChild
              className=" flex w-full justify-start text-start text-xl font-bold"
              variant="ghost"
            >
              <Link href={`/dashboard/vendor-profile`}>Vendor Profile</Link>
            </Button>
            <Button
              asChild
              className=" flex w-full justify-start text-start text-xl font-bold"
              variant="ghost"
            >
              <Link href={`/dashboard/vendor-products`}>Your Products</Link>
            </Button>
          </>
        )}
        <Separator className="my-3 h-[2px] rounded-full" />
      </nav>
    )
  );
}
