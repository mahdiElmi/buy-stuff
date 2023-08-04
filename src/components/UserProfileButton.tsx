"use client";
import { SignOutButton } from "@clerk/nextjs";
import { EmailAddress } from "@clerk/nextjs/dist/types/server";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

function UserProfileButton({
  profileImageUrl,
  username,
  userEmail,
}: {
  profileImageUrl: string | undefined;
  username: string | null;
  userEmail: EmailAddress[];
}) {
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-900">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div className="flex items-center px-4 pb-3">
                  <div>
                    <Image
                      className="inline-block rounded-full"
                      src={profileImageUrl ? profileImageUrl : ""}
                      width={45}
                      height={45}
                      alt="profile picture"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-100">
                      {username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {userEmail[0].emailAddress}
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
                    "block px-4 py-2 text-sm font-medium",
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
                    "block px-4 py-2 text-sm font-medium",
                  )}
                >
                  Settings
                </a>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <SignOutButton
                  // @ts-ignore
                  className={classNames(
                    active
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300"
                      : "text-zinc-700 dark:text-zinc-300",
                    "block w-full px-4 py-2 text-left text-sm font-medium",
                  )}
                >
                  Sign out
                </SignOutButton>
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default UserProfileButton;
