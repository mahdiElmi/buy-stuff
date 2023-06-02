import Link from "next/link";
import { auth, clerkClient, UserButton } from "@clerk/nextjs";

function Header() {
  return (
    <header className="sticky top-0 border-b border-neutral-600 bg-black bg-opacity-50 py-1 backdrop-blur-lg ">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between sm:px-6 lg:px-8 ">
        <Link
          href="/"
          className="h-min w-min break-words rounded-md p-[1px] text-4xl font-black leading-none hover:bg-neutral-500"
        >
          BUY STUFF
        </Link>
        <Link
          href="/products"
          className="h-min w-min break-words rounded-md p-[1px] text-4xl leading-none hover:bg-neutral-500"
        >
          Products
        </Link>
        <Link
          href="/about"
          className="h-min w-min break-words rounded-md p-[1px] text-4xl leading-none hover:bg-neutral-500"
        >
          About
        </Link>
        <div className="flex items-center space-x-5">
          <Link
            href="/shopping-cart"
            className="h-min w-min break-words rounded-md p-[1px] text-4xl leading-none hover:bg-neutral-500"
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="h-w-12 w-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </Link>

          {/* <Link
            href="/profile"
            className="h-min w-min break-words rounded-md p-[1px] text-4xl leading-none hover:bg-neutral-500"
          >
            Profile
          </Link> */}
          {auth().userId ? (
            <div>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="h-min w-min break-words rounded-md p-[1px] text-4xl leading-none hover:bg-neutral-500"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
