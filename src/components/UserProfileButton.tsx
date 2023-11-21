"use client";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

function UserProfileButton() {
  console.log("bruhhhhhhh", useSession());
  const { data: session } = useSession();
  if (session) {
    const {
      name: username,
      email: userEmail,
      image: profileImageUrl,
    } = session.user!; // TODO: maybe get rid of the exclamation mark?
    return (
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="ring-zinc-30 rounded-full shadow-sm ring-1 ring-inset">
            <Image
              className="rounded-full bg-zinc-500"
              src={profileImageUrl ? profileImageUrl : ""}
              alt="profile picture"
              width={36}
              height={36}
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-900">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <div className="flex items-center pb-3">
                    {/* <div>
                      <Image
                        className="inline-block rounded-full"
                        src={profileImageUrl ? profileImageUrl : ""}
                        width={45}
                        height={45}
                        alt="profile picture"
                      />
                    </div> */}
                    <div className="ml-3">
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-100">
                        {username}
                      </p>
                      <p className="text-base text-gray-500 dark:text-gray-300">
                        {userEmail ?? ""}
                      </p>
                    </div>
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/dashboard"
                    className={classNames(
                      active
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
                        : "text-zinc-700 dark:text-zinc-300",
                      "block px-4 py-2 text-sm font-semibold",
                    )}
                  >
                    Dashboard
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
                        : "text-zinc-700 dark:text-zinc-300",
                      "block px-4 py-2 text-sm font-semibold",
                    )}
                  >
                    Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => signOut()}
                    className={classNames(
                      active
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
                        : "text-zinc-700 dark:text-zinc-300",
                      "block px-4 py-2 text-sm font-semibold",
                    )}
                  >
                    Sign Out
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      // <Menu>
      //   <Menu.Button>

      //   </Menu.Button>
      //   <Menu.Items>
      //     <Menu.Item>
      //       {({ active }) => (
      //         <a
      //           className={`${active && "bg-blue-500"}`}
      //           href="/account-settings"
      //         >
      //           Account settings
      //         </a>
      //       )}
      //     </Menu.Item>
      //     <Menu.Item>
      //       {({ active }) => (
      //         <a
      //           className={`${active && "bg-blue-500"}`}
      //           href="/account-settings"
      //         >
      //           Documentation
      //         </a>
      //       )}
      //     </Menu.Item>
      //     <Menu.Item disabled>
      //       <span className="opacity-75">Invite a friend (coming soon!)</span>
      //     </Menu.Item>
      //   </Menu.Items>
      // </Menu>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="h-min w-max rounded-xl p-2 text-2xl font-medium leading-none 
              text-zinc-950 dark:text-zinc-50 dark:hover:text-white "
    >
      Sign In
    </button>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default UserProfileButton;
