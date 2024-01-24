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
  // console.log("bruhhhhhhh", useSession());
  // const { data: session } = useSession();
  // if (session && session.user) {
  //   const {
  //     name: username,
  //     email: userEmail,
  //     image: profileImageUrl,
  //   } = session.user;

  //   return (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger>
  //         <Image
  //           className="rounded-full bg-zinc-500"
  //           src={profileImageUrl ? profileImageUrl : ""}
  //           alt="profile picture"
  //           width={32}
  //           height={32}
  //         />
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent>
  //         <DropdownMenuLabel>
  //           <div className="flex items-center">
  //             <div className="">
  //               <p className="text-base font-bold text-zinc-700 dark:text-zinc-100">
  //                 {username}
  //               </p>
  //               <p className="text-sm text-zinc-500 dark:text-zinc-300">
  //                 {userEmail ?? ""}
  //               </p>
  //             </div>
  //           </div>
  //         </DropdownMenuLabel>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem>
  //           <Link
  //             href="/dashboard"
  //             // className={cn(
  //             //   active
  //             //     ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
  //             //     : "text-zinc-700 dark:text-zinc-300",
  //             //   "block px-4 py-2 text-sm font-semibold",
  //             // )}
  //           >
  //             Dashboard
  //           </Link>
  //         </DropdownMenuItem>
  //         <DropdownMenuItem>
  //           <a
  //             href="#"
  //             // className={cn(
  //             //     ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
  //             //     : "text-zinc-700 dark:text-zinc-300",
  //             //   "block px-4 py-2 text-sm font-semibold",
  //             // )}
  //           >
  //             Settings
  //           </a>
  //         </DropdownMenuItem>
  //         <DropdownMenuItem>
  //           <a
  //             href="#"
  //             onClick={() => signOut()}
  //             // className={cn(
  //             //     ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
  //             //     : "text-zinc-700 dark:text-zinc-300",
  //             //   "block px-4 py-2 text-sm font-semibold",
  //             // )}
  //           >
  //             Sign Out
  //           </a>
  //         </DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //     // <Menu as="div" className="relative inline-block text-left">
  //     //   <div>
  //     //     <Menu.Button className="ring-zinc-30 w-9 rounded-full shadow-sm ring-1 ring-inset">
  //     //       <Image
  //     //         className="rounded-full bg-zinc-500"
  //     //         src={profileImageUrl ? profileImageUrl : ""}
  //     //         alt="profile picture"
  //     //         width={36}
  //     //         height={36}
  //     //       />
  //     //     </Menu.Button>
  //     //   </div>

  //     //   <Transition
  //     //     as={Fragment}
  //     //     enter="transition ease-out duration-100"
  //     //     enterFrom="transform opacity-0 scale-95"
  //     //     enterTo="transform opacity-100 scale-100"
  //     //     leave="transition ease-in duration-75"
  //     //     leaveFrom="transform opacity-100 scale-100"
  //     //     leaveTo="transform opacity-0 scale-95"
  //     //   >
  //     //     <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-900">
  //     //       <div className="py-1">
  //     //         <Menu.Item>
  //     //           {({ active }) => (
  //     //             <div className="flex items-center pb-3">
  //     //               {/* <div>
  //     //                 <Image
  //     //                   className="inline-block rounded-full"
  //     //                   src={profileImageUrl ? profileImageUrl : ""}
  //     //                   width={45}
  //     //                   height={45}
  //     //                   alt="profile picture"
  //     //                 />
  //     //               </div> */}
  //     //               <div className="ml-3">
  //     //                 <p className="text-lg font-bold text-zinc-700 dark:text-zinc-100">
  //     //                   {username}
  //     //                 </p>
  //     //                 <p className="text-base text-zinc-500 dark:text-zinc-300">
  //     //                   {userEmail ?? ""}
  //     //                 </p>
  //     //               </div>
  //     //             </div>
  //     //           )}
  //     //         </Menu.Item>
  //     //         <Menu.Item>
  //     //           {({ active }) => (
  //     //             <Link
  //     //               href="/dashboard"
  //     //               className={cn(
  //     //                 active
  //     //                   ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
  //     //                   : "text-zinc-700 dark:text-zinc-300",
  //     //                 "block px-4 py-2 text-sm font-semibold",
  //     //               )}
  //     //             >
  //     //               Dashboard
  //     //             </Link>
  //     //           )}
  //     //         </Menu.Item>
  //     //         <Menu.Item>
  //     //           {({ active }) => (
  //     //             <a
  //     //               href="#"
  //     //               className={cn(
  //     //                 active
  //     //                   ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
  //     //                   : "text-zinc-700 dark:text-zinc-300",
  //     //                 "block px-4 py-2 text-sm font-semibold",
  //     //               )}
  //     //             >
  //     //               Settings
  //     //             </a>
  //     //           )}
  //     //         </Menu.Item>
  //     //         <Menu.Item>
  //     //           {({ active }) => (
  //     //             <a
  //     //               href="#"
  //     //               onClick={() => signOut()}
  //     //               className={cn(
  //     //                 active
  //     //                   ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
  //     //                   : "text-zinc-700 dark:text-zinc-300",
  //     //                 "block px-4 py-2 text-sm font-semibold",
  //     //               )}
  //     //             >
  //     //               Sign Out
  //     //             </a>
  //     //           )}
  //     //         </Menu.Item>
  //     //       </div>
  //     //     </Menu.Items>
  //     //   </Transition>
  //     // </Menu>
  //   );
  // }

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
            <Link
              href="/dashboard"
              className="flex items-center gap-1"

              // className={cn(
              //   active
              //     ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
              //     : "text-zinc-700 dark:text-zinc-300",
              //   "block px-4 py-2 text-sm font-semibold",
              // )}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              href="#"
              className="flex items-center gap-1"
              // className={cn(
              //     ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
              //     : "text-zinc-700 dark:text-zinc-300",
              //   "block px-4 py-2 text-sm font-semibold",
              // )}
            >
              <Settings className="h-5 w-5" />
              Settings
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              href="#"
              className="flex items-center gap-1"
              onClick={() => signOut()}
              // className={cn(
              //     ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
              //     : "text-zinc-700 dark:text-zinc-300",
              //   "block px-4 py-2 text-sm font-semibold",
              // )}
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
