"use client";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import { UserWithShoppingCart } from "@/lib/types";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";

function UserProfileButton({ user }: { user: UserWithShoppingCart }) {
  return (
    <div className="h-8 w-8">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <Image
            className="rounded-full bg-zinc-500"
            src={user.image}
            alt="profile picture"
            width={32}
            height={32}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
            <Link href="/dashboard" className="flex items-center gap-1">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="#" className="flex items-center gap-1">
              <Settings className="h-5 w-5" />
              Settings
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              href="#"
              className="flex items-center gap-1"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserProfileButton;
