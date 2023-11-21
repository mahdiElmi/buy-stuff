"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import UserProfileButton from "./UserProfileButton";
import { usePathname } from "next/navigation";

function Navbar({ theme }: { theme: string }) {
  const pathname = usePathname();
  // console.log(pathname, pathname === "/blog" ? "yes" : "no");
  return (
    <nav className="sticky top-0 z-50 bg-zinc-50 bg-opacity-50 px-3 backdrop-blur-lg dark:bg-zinc-950 xl:px-0 ">
      <div className="mx-auto flex max-w-[95rem] items-center gap-5 border-b border-zinc-200 py-1 dark:border-zinc-800 ">
        <Link
          href="/"
          className="h-min w-min break-words rounded-sm p-[1px] text-3xl font-black leading-none transition-transform "
        >
          BUY STUFF
        </Link>
        <Link
          href="/products"
          className={`${
            pathname === "/products" ? "opacity-100" : "opacity-80"
          } h-min w-min rounded-sm p-[1px] text-2xl font-medium capitalize leading-none transition-transform 
          hover:opacity-100`}
        >
          products
        </Link>
        <Link
          href="/about"
          className={`${
            pathname === "/about" ? "opacity-100" : "opacity-80"
          } h-min w-min rounded-sm p-[1px] text-2xl font-medium capitalize leading-none transition-transform 
          hover:opacity-100`}
        >
          about
        </Link>
        <Link
          href="/blog"
          className={`${
            pathname === "/blog" ? "opacity-100" : "opacity-80"
          } h-min w-min rounded-sm p-[1px] text-2xl font-medium capitalize leading-none transition-transform 
          hover:opacity-100`}
        >
          blog
        </Link>
        <div className="ms-auto flex items-center space-x-5">
          <ThemeToggle theme={theme} />
          <Link
            href="/shopping-cart"
            className="h-min w-min rounded-sm p-[1px] text-2xl font-medium leading-none transition-transform 
            hover:ring hover:ring-zinc-950 dark:hover:ring-zinc-50"
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </Link>
          <UserProfileButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
