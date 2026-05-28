import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserWithShoppingCartAndVendor } from "@/lib/types";
import { Heart, LayoutDashboard, List, PanelTop } from "lucide-react";
import SignOutButton from "./SignOutButton";

function UserProfileButton({ user }: { user: UserWithShoppingCartAndVendor }) {
  return (
    <div className="size-7">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Image
            className="rounded-full bg-zinc-500"
            src={user.image || "/avatar.png"}
            alt="profile picture"
            width={32}
            height={32}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuLabel>
            <div className="flex items-center">
              <div className="">
                <p className="text-base font-bold text-zinc-700 dark:text-zinc-100">
                  {user.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-300">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 hover:cursor-pointer"
            >
              <LayoutDashboard className="size-5" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/dashboard/favorites"
              className="flex items-center gap-2 hover:cursor-pointer"
            >
              <Heart className="size-5 fill-current" />
              Favorites
            </Link>
          </DropdownMenuItem>
          {user.vendor && (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href={`/vendors/${user.vendor.id}`}
                  className="flex items-center gap-2 hover:cursor-pointer"
                >
                  <PanelTop className="size-5" />
                  Vendor Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/vendor-products"
                  className="flex items-center gap-2 hover:cursor-pointer"
                >
                  <List className="size-5 fill-current" />
                  Your Products
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem className="p-0">
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserProfileButton;
