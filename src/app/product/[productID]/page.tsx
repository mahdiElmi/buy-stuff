import { prisma } from "@/lib/db";
import { Prisma, Vote } from "@prisma/client";

import { StarIcon } from "@heroicons/react/20/solid";
import ImageGroup from "./ImageGroup";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import DeleteButton from "../../../components/DeleteButton";
import ReviewForm from "./ReviewForm";
import VoteButtons from "./VoteButtons";
import deleteReview from "./ReviewDeleteAction";
import CustomRating from "@/components/ui/CustomRating";
import { Button } from "@/components/ui/button";
import ReviewDate from "./ReviewDate";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "./AddToCartButton";

const userWithReviewerVotes = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { reviewVotes: true },
});
type UserWithReviewerVotes = Prisma.UserGetPayload<
  typeof userWithReviewerVotes
>;

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = params;
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      reviews: {
        include: {
          reviewedBy: { include: { vendor: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      vendor: true,
      images: true,
    },
  });

  const session = await getServerSession(authOptions);
  if (!product) return <div>No product found. :(</div>;
  const vendor = await prisma.vendor.findUnique({
    where: {
      id: product.vendorId,
    },
  });
  let user: UserWithReviewerVotes | null = null;
  if (session && session.user && session.user.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { reviewVotes: true },
    });
  }
  const isAuthor = vendor?.userId === user?.id;

  // calculate rating distribution
  const ratingCounts: [number, number, number, number, number] = [
    0, 0, 0, 0, 0,
  ];
  for (let review of product.reviews) {
    switch (review.rating) {
      case 1:
        ++ratingCounts[0];
        break;
      case 2:
        ++ratingCounts[1];
        break;
      case 3:
        ++ratingCounts[2];
        break;
      case 4:
        ++ratingCounts[3];
        break;
      case 5:
        ++ratingCounts[4];
        break;
      default:
        break;
    }
  }
  const AverageRating = parseFloat(
    (product.reviews.length > 0
      ? product.reviews.reduce(
          (acc, currentReview) => currentReview.rating + acc,
          0,
        ) / product.reviews.length
      : 0
    ).toFixed(1),
  );
  const indexedVotes = new Map<string, Vote>();
  if (user) {
    for (const vote of user?.reviewVotes) {
      indexedVotes.set(vote.reviewId, vote);
    }
  }

  const reviewElements =
    product.reviews.length >= 1 ? (
      product.reviews.map((review) => (
        <div key={review.id} className="relative flex w-full">
          <VoteButtons
            voteCount={review.upvoteCount}
            userId={user ? user.id : null}
            vote={indexedVotes.get(review.id)}
            reviewId={review.id}
            className=" place-self-center overflow-clip rounded-l-lg bg-zinc-100 py-1 dark:bg-zinc-800 "
          />
          <div className="flex w-full flex-col rounded-lg bg-zinc-200/60 p-7 dark:bg-zinc-900">
            <div className="flex w-full items-center gap-4 ">
              <Image
                width={40}
                height={40}
                src={review.reviewedBy.image}
                alt={review.reviewedBy.name}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 text-sm font-bold">
                  <Link href={`/u/${review.reviewedBy.id}`}>
                    {review.reviewedBy.name}
                  </Link>
                  {review.reviewedBy.vendor && (
                    <Link href={`/vendors/${review.reviewedBy.vendor.id}`}>
                      <Badge
                        variant="simple"
                        className="bg-emerald-200 font-semibold tracking-wide text-emerald-800 dark:bg-emerald-900  dark:text-emerald-50"
                      >
                        Also Sells Stuff!
                      </Badge>
                    </Link>
                  )}
                </div>

                <CustomRating
                  color="gold"
                  className="max-w-28"
                  // style={{ maxWidth }}
                  value={review.rating}
                  readOnly={true}
                />
                <p className="sr-only">{review.rating} out of 5 stars</p>
              </div>
              {review.userId === user?.id && (
                <div className="ms-auto">
                  <DeleteButton id={review.id} deleteAction={deleteReview} />
                </div>
              )}
            </div>
            <h3 className="mb-1 mt-6 text-lg font-bold">{review.title}</h3>
            <div
              className="col-span-full col-start-2 flex-none space-y-6 p-1 text-base text-zinc-800 dark:text-zinc-200"
              dangerouslySetInnerHTML={{ __html: review.body }}
            />
          </div>
          <ReviewDate
            className="absolute bottom-2 right-2"
            date={review.createdAt}
          />
        </div>
      ))
    ) : (
      <div className="m-auto flex h-20 flex-col items-center justify-center rounded-xl bg-zinc-100 px-7 text-center text-xl font-semibold dark:bg-zinc-900">
        No reviews yet. Be the first to share your thoughts!
      </div>
    );

  return (
    <div className="">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-8xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <ImageGroup images={product.images} />
          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <Link
              className="hover:text-sky-400 hover:underline"
              href={`/vendors/${product.vendorId}`}
            >
              {product.vendor.name}
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight">{product.price}$</p>
            </div>
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-zinc-700 dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
            {/* <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>
            </section> */}

            <AddToCartButton
              quantity={product.stock}
              userId={user && user.id}
              product={product}
            />
          </div>
        </div>
      </div>
      {/* REVIEW SECTION */}
      <div className="mx-auto flex max-w-2xl flex-col gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl  lg:gap-x-8 lg:px-8 lg:py-32">
        <div className="flex w-full flex-col gap-8 lg:flex-row">
          <div className="lg:w-96">
            <h2 className="w-max text-2xl font-bold tracking-tight">
              Customer Reviews
            </h2>
            <div className="flex gap-5">
              <CustomRating
                className="max-w-52"
                color="gold"
                // style={{ maxWidth }}
                value={AverageRating}
                readOnly={true}
              />
              <h3 className="text-6xl font-bold">
                {AverageRating}
                <span className="text-3xl">/5</span>
              </h3>
            </div>

            <div className="mt-3 flex items-center">
              <div>
                <div className="flex items-center"></div>
                <p className="sr-only">{AverageRating} out of 5 stars</p>
              </div>
              <p className="ml-2 text-sm font-semibold ">
                Based on {product.reviews.length} review
                {product.reviews.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Review data</h3>

              <dl className="space-y-3">
                {ratingCounts.map((count, i) => (
                  <div key={i} className="flex items-center text-sm">
                    <dt className="flex flex-1 items-center">
                      <p className="w-3 font-medium">
                        {i + 1}
                        <span className="sr-only"> star reviews</span>
                      </p>
                      <div
                        aria-hidden="true"
                        className="ml-1 flex flex-1 items-center"
                      >
                        <StarIcon
                          className={cn(
                            count > 0 ? "text-yellow-400" : "text-zinc-300 ",
                            "h-5 w-5 flex-shrink-0",
                          )}
                          aria-hidden="true"
                        />

                        <div className="relative ml-3 flex-1">
                          <div className="h-3 rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-900 dark:bg-zinc-800" />
                          {count > 0 ? (
                            <div
                              className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                              style={{
                                width: `calc(${count} / ${product.reviews.length} * 100%)`,
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </dt>
                    <dd className="ml-3 w-10 text-right text-sm tabular-nums ">
                      {count > 0 && product.reviews.length > 0
                        ? Math.round((count / product.reviews.length) * 100)
                        : 0}
                      %
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="flex-grow">
            {user !== null && !isAuthor ? (
              <ReviewForm user={user} productId={productId} />
            ) : (
              <div className="flex h-full  items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900/20">
                <Button
                  className="text-xl font-semibold"
                  variant="link"
                  asChild
                >
                  <Link href="/sign-in">Login to write a review</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <h3 className="sr-only">Recent reviews</h3>

          <div className="flow-root h-full">
            <div className="flex flex-col gap-10">{reviewElements}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
