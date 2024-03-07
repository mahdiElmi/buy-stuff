import { PostDataType } from "@/postsData";
import { faker } from "@faker-js/faker";
import { Clock, Hourglass, Timer } from "lucide-react";
import { Route } from "next";
import Image from "next/image";
import Link from "next/link";
function BlogPostCard({ post }: { post: PostDataType }) {
  const { id, title, description, timeToRead } = post;
  const randomImage = faker.image.avatarLegacy();
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-zinc-300 bg-zinc-50 @container hover:bg-white hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-black">
      <Link
        href={`/blog/${id}` as Route}
        className="decoration group space-y-2 decoration-indigo-600 decoration-2 underline-offset-1 @xs:space-y-6 hover:text-indigo-600 hover:underline dark:decoration-indigo-500 dark:hover:text-indigo-500"
      >
        <div className="relative before:absolute before:h-full before:w-full before:bg-gradient-to-t before:from-zinc-900 before:via-zinc-900/40  before:content-['']">
          <span className="absolute bottom-3 right-2 flex items-center gap-1 font-medium text-zinc-300">
            <Timer className="h-4 w-4" /> {timeToRead} min read
          </span>
          <div className="absolute bottom-3 left-5 mt-8 flex items-center gap-x-4">
            <Image
              width={50}
              height={50}
              src={randomImage}
              alt=""
              className="h-10 w-10 rounded-full bg-zinc-100"
            />
            <div className="text-sm leading-6">
              <p className="font-semibold text-zinc-100">{post.author.name}</p>
              <p className="text-zinc-400">{post.author.role}</p>
            </div>
          </div>
          <Image
            className=" "
            src={`https://picsum.photos/id/${id + 10}/800/500.webp`}
            alt=""
            width={800}
            height={500}
          />
        </div>
        <h3 className="px-2 text-lg font-bold @xs:px-5 @xs:text-2xl">
          {title}
        </h3>
      </Link>
      <p className="mb-2 line-clamp-3 px-2 pt-0 text-base font-medium text-zinc-600 @xs:mb-5 @xs:px-5 @xs:pt-2 @xs:text-lg dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

export default BlogPostCard;
