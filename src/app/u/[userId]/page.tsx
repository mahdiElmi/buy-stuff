import DateToggle from "@/app/product/[productId]/DateToggle";
import ReviewSort from "@/app/product/[productId]/ReviewSort";
import { FilteredAndSortedProductList } from "@/components/ProductGrid";
import CustomRating from "@/components/ui/CustomRating";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
export async function generateMetadata(props: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { userId } = params;
  if (!userId) notFound();
  const vendor = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: { name: true },
  });
  if (!vendor) notFound();

  const { name: title } = vendor;
  return {
    title: `${title}'s Profile`,
  };
}
async function page(props: {
  searchParams: Promise<{
    view: "reviews" | "favorites";
    sort: "top" | "new" | "old";
  }>;
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { view = "reviews", sort = "new" } = searchParams;
  const { userId } = params;

  let orderByObjectBasedOnSort: {};
  switch (sort) {
    case "top":
      orderByObjectBasedOnSort = { upvoteCount: "desc" };
      break;
    case "new":
      orderByObjectBasedOnSort = { createdAt: "desc" };
      break;
    case "old":
      orderByObjectBasedOnSort = { createdAt: "asc" };
      break;
    default:
      orderByObjectBasedOnSort = { createdAt: "desc" };
      break;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      vendor: true,
      reviews: {
        include: { reviewed: true },
        orderBy: orderByObjectBasedOnSort,
      },
      favorites: {
        include: {
          _count: { select: { reviews: true } },
          images: true,
          vendor: true,
        },
      },
    },
  });
  if (!user)
    return (
      <div className="mx-1 mt-5 flex h-[85dvh] w-full items-center justify-center rounded-lg border-2 border-yellow-500 text-4xl font-black md:text-5xl">
        User not found
      </div>
    );

  const ReviewElements = user.reviews.map((review) => (
    <div key={review.id} className="relative flex w-full">
      <div className="relative flex w-full flex-col rounded-lg bg-zinc-200 p-7 dark:bg-zinc-900">
        <span className="absolute end-1 top-1 text-xs text-zinc-600 dark:text-zinc-400">
          {review.upvoteCount} upvotes
        </span>
        <div className="flex w-full items-center gap-2">
          <div className="flex flex-col">
            <span className="text-muted text-muted mb-2 text-xs md:text-base">
              Review for
              <Link
                className="ms-2 font-semibold hover:text-blue-500"
                href={`/product/${review.reviewed.id}`}
              >
                {review.reviewed.name}
              </Link>
            </span>

            <CustomRating
              color="gold"
              className="max-w-28"
              // style={{ maxWidth }}
              value={review.rating}
              readOnly={true}
            />
            <p className="sr-only">{review.rating} out of 5 stars</p>
          </div>
        </div>
        <h3 className="mt-3 mb-1 font-bold md:text-lg">{review.title}</h3>
        <div
          className="col-span-full col-start-2 flex-none px-1 text-sm text-zinc-800 md:text-base dark:text-zinc-200"
          dangerouslySetInnerHTML={{ __html: review.body }}
        />
      </div>
      <DateToggle
        className="absolute right-2 bottom-2"
        date={review.createdAt}
      />
    </div>
  ));

  return (
    <div className="mt-5 flex h-[85dvh] w-full max-w-6xl flex-col rounded-lg border-zinc-400 bg-linear-to-b from-zinc-100 to-zinc-200 md:mx-1 dark:border-zinc-500 dark:from-zinc-800 dark:to-zinc-900">
      <div className="flex w-full items-center border-zinc-600 *:h-full *:border-zinc-600 md:h-32">
        <div
          className={cn(
            "flex w-fit grow items-end border-b-2 p-3",
            view === "reviews" && "rounded-br-md border-r-2",
          )}
        >
          <Image
            width={80}
            height={80}
            src={user.image || "/avatar.png"}
            alt={`${user.name} profile picture`}
            className="size-10 self-center rounded-full md:h-20 md:w-20"
          />
          <div className="ms-3">
            <h1 className="text-sm font-bold md:text-3xl">{user.name}</h1>
            <span className="min-w-max text-xs font-medium text-zinc-500 md:text-sm dark:text-zinc-300">
              Joined {new Intl.DateTimeFormat().format(user.createdAt)}
            </span>
            {user.vendor && (
              <Link
                className="block text-xs font-semibold text-zinc-700 decoration-2 underline-offset-4 transition-colors hover:underline md:ms-2 md:inline-block md:text-base dark:text-zinc-200"
                href={`/vendors/${user.vendor.id}`}
              >
                Vendor Page
              </Link>
            )}
          </div>
        </div>
        <Link
          className={cn(
            "flex items-center border-b-2 p-3 text-sm font-bold hover:bg-white md:text-3xl dark:hover:bg-zinc-900",
            view === "reviews"
              ? "border-t-2 border-b-0"
              : "rounded-br-md border-r-2",
          )}
          href="?view=reviews"
        >
          Reviews
        </Link>
        <Link
          className={cn(
            "flex items-center rounded-tr-md border-b-2 p-3 text-sm font-bold hover:bg-white md:text-3xl dark:hover:bg-zinc-900",
            view === "favorites"
              ? "border-t-2 border-r-2 border-b-0"
              : "rounded-bl-md border-l-2",
          )}
          href="?view=favorites"
        >
          Favorites
        </Link>
        <div className="shrink border-b-2"></div>
      </div>
      <section className="scrollbar dark:scrollbar-thumb-zinc-700 dark:hover:scrollbar-thumb-zinc-600 dark:active:scrollbar-thumb-zinc-500 h-full overflow-y-auto rounded-b-lg border-2 border-t-0 border-zinc-600">
        {view === "reviews" ? (
          user.reviews.length > 0 ? (
            <div className="flex flex-col gap-5 p-4">
              <ReviewSort value={sort} />
              {ReviewElements}
            </div>
          ) : (
            <div className="flex size-full items-center justify-center text-3xl font-black">
              No Reviews Found!
            </div>
          )
        ) : user.favorites.length > 0 ? (
          <div className="flex flex-col gap-10 p-2">
            <FilteredAndSortedProductList products={user.favorites} />
          </div>
        ) : (
          <div className="flex size-full items-center justify-center text-3xl font-black">
            User has no favorites!
          </div>
        )}
      </section>
    </div>
  );
}

export default page;
