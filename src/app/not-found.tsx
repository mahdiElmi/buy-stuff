import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex h-full min-h-screen w-full flex-grow flex-col items-center justify-center gap-4 px-6 lg:px-8">
      <p className="font-semibold text-indigo-600">404</p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="text-xl font-medium text-zinc-600 dark:text-zinc-400">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link
        href="/"
        className="block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Go back home
      </Link>
    </section>
  );
}
