"use client";

import BlogPostCard from "@/components/BlogPostCard";
import posts from "@/postsData";
import { useMemo, useState } from "react";
import { Input } from "./ui/input";

function Posts() {
  const [searchInput, setSearchInput] = useState("");
  const postElements = useMemo(
    () =>
      posts.reduce<JSX.Element[]>((prev, post) => {
        const regex = new RegExp(`${escapeRegex(searchInput)}`, "gi");

        if (regex.test(post.title) === false) return prev;
        prev.push(<BlogPostCard key={post.id} post={post} />);
        return prev;
      }, []),
    [searchInput],
  );

  return (
    <section className="flex flex-grow flex-col gap-8">
      <label className="relative flex w-full flex-row items-center self-center ">
        <Input
          className="h-14 w-full rounded-lg border-2 border-b-zinc-300 border-t-zinc-100 bg-zinc-200 p-1 ps-11 text-3xl font-medium tracking-tight shadow-inner dark:bg-zinc-800"
          type="text"
          placeholder="Search Blog by title"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.currentTarget.value);
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="absolute left-2 h-8 w-8 stroke-2 opacity-70"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </label>

      <h1 className="text-4xl font-semibold tracking-tight">
        {searchInput.length === 0 ? "Latest Articles" : "Search Results"}
      </h1>

      <div className="grid h-full flex-grow grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {postElements.length > 0 ? (
          postElements
        ) : (
          <div className="col-span-full mt-20 max-w-lg justify-self-center text-center">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 ">
              No results found
            </h2>
            <p className="text-xl font-medium text-zinc-600 dark:text-zinc-400">
              We can’t find anything with that term at the moment, try searching
              something else.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function escapeRegex(string: string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
}

export default Posts;
