import { prisma } from "@/lib/db";
import { Vote } from "@prisma/client";

import { StarIcon } from "@heroicons/react/20/solid";
import ImageGroup from "./ImageGroup";
import Image from "next/image";
import { auth } from "@/server/auth";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import DeleteButton from "../../../components/DeleteButton";
import ReviewForm from "./ReviewForm";
import VoteButtons from "./VoteButtons";
import deleteReview from "./ReviewDeleteAction";
import CustomRating from "@/components/ui/CustomRating";
import { Button } from "@/components/ui/button";
import DateToggle from "./DateToggle";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "./AddToCartButton";
import AddFavoriteButton from "../../../components/AddFavoriteButton";
import { ChevronRight, Home, Pencil } from "lucide-react";
import ProductDeleteButton from "./ProductDeleteButton";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    select: { name: true, description: true },
  });
  if (product === null) notFound();
  const { name: title, description } = product;
  return {
    title,
    description,
  };
}

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
      categories: true,
    },
  });

  if (!product) return <div>No product found. :(</div>;
  const category = product.categories[0];
  const session = await auth();

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: product.vendorId,
    },
  });

  const user =
    session && session.user && session.user.email
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            reviewVotes: true,
            favorites: {
              where: { id: product.id },
              select: { id: true },
            },
          },
        })
      : null;

  const isAuthor = vendor?.userId === user?.id;
  const hasUserAddedToFavorites = !!user?.favorites[0];

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
  // const AverageRating = parseFloat(
  //   (product.reviews.length > 0
  //     ? product.reviews.reduce(
  //         (acc, currentReview) => currentReview.rating + acc,
  //         0,
  //       ) / product.reviews.length
  //     : 0
  //   ).toFixed(1),
  // );
  const formattedAverageRating = product.averageRating.toFixed(
    product.averageRating % 1 === 0 ? 0 : 1,
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
            <div className="flex w-full items-center gap-2 ">
              <Image
                width={40}
                height={40}
                src={review.reviewedBy.image}
                alt={`${review.reviewedBy.name} profile picture`}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col">
                <div className="flex gap-2 text-sm font-bold">
                  <Link href={`/u/${review.reviewedBy.id}`}>
                    {review.reviewedBy.name}
                  </Link>
                  {review.reviewedBy.vendor && (
                    <Link href={`/vendors/${review.reviewedBy.vendor.id}`}>
                      <Badge
                        variant="simple"
                        className="min-w-max bg-emerald-200 font-semibold tracking-wide text-emerald-800 dark:bg-emerald-900 dark:text-emerald-50 "
                      >
                        Sells Stuff
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
            <h3 className=" mb-1 mt-3 font-bold md:text-lg">{review.title}</h3>
            <div
              className="col-span-full col-start-2 flex-none px-1 text-sm text-zinc-800 dark:text-zinc-200 md:text-base"
              dangerouslySetInnerHTML={{ __html: review.body }}
            />
          </div>
          <DateToggle
            className="absolute bottom-2 right-2"
            date={review.createdAt}
          />
        </div>
      ))
    ) : (
      <div className="m-auto flex h-20 flex-col items-center justify-center rounded-xl bg-zinc-100 px-7 text-center text-xl font-semibold dark:bg-zinc-900">
        No reviews yet. {!isAuthor && "Be the first to share your thoughts!"}
      </div>
    );

  return (
    <div className=" h-full w-full">
      <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-8xl lg:px-8">
        <nav className="mb-6 flex" aria-label="Breadcrumb">
          <ol role="list" className=" flex items-center space-x-4">
            <li>
              <div>
                <Link
                  href="/products"
                  className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                >
                  <Home className="h-5 w-5 flex-shrink-0 " aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight
                  className="h-5 w-5 flex-shrink-0 text-zinc-400 dark:text-zinc-400"
                  aria-hidden="true"
                />
                <Link
                  href="/products"
                  className="ml-4 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                >
                  Products
                </Link>
              </div>
            </li>
            {category && (
              <li>
                <div className="flex items-center">
                  <ChevronRight
                    className="h-5 w-5 flex-shrink-0 text-zinc-400 dark:text-zinc-400"
                    aria-hidden="true"
                  />
                  <Link
                    href={`/products/${category.name}`}
                    className="ml-4 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                  >
                    {category.name}
                  </Link>
                </div>
              </li>
            )}
          </ol>
        </nav>
        <div className="flex flex-col gap-14 md:flex-row">
          {/* Image gallery */}
          <ImageGroup images={product.images} />
          {/* Product info */}
          <div className="relative mt-10 px-4 sm:mt-16 sm:px-0 md:w-1/2 lg:mt-0">
            {isAuthor && (
              <div className="absolute right-0 top-0 flex gap-1">
                <Button
                  className="h-8 w-8 p-0"
                  asChild
                  variant="outline"
                  title="Edit Product"
                >
                  <Link href={`/product/${product.id}/edit`}>
                    <span className="sr-only">Edit product</span>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <ProductDeleteButton productId={product.id} />
              </div>
            )}

            <Link
              className="hover:text-sky-400 hover:underline"
              href={`/vendors/${product.vendorId}`}
            >
              {product.vendor.name}
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-1 pt-1">
                <span className="font-bold">{formattedAverageRating}/5</span>
                <CustomRating
                  className="max-w-24"
                  readOnly
                  color="gold"
                  value={product.averageRating}
                />
                <Link
                  href="#reviews"
                  className="ms-3 font-medium text-blue-500"
                >
                  See {product.reviews.length > 1 && "all"}{" "}
                  {product.reviews.length} review
                  {product.reviews.length > 1 && "s"}
                </Link>
              </div>
            )}
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight first-letter:font-extralight">
                {formatPrice(product.price)}
              </p>
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

            <div className="flex items-end gap-3">
              {user && (
                <AddFavoriteButton
                  favoriteInitialState={hasUserAddedToFavorites}
                  productId={product.id}
                />
              )}
              <AddToCartButton
                quantity={product.stock}
                userId={user && user.id}
                product={product}
              />
            </div>
          </div>
        </div>
      </div>
      {/* REVIEW SECTION */}
      <div
        id="reviews"
        className="mx-auto flex max-w-2xl flex-col gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl  lg:gap-x-8 lg:px-8 lg:py-32"
      >
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
                value={product.averageRating}
                readOnly={true}
              />
              <h3 className="text-6xl font-bold">
                {formattedAverageRating}
                <span className="text-3xl">/5</span>
              </h3>
            </div>

            <div className="mt-3 flex items-center">
              <div>
                <div className="flex items-center"></div>
                <p className="sr-only">
                  {formattedAverageRating} out of 5 stars
                </p>
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
              <div className="flex h-full min-h-52 items-center justify-center rounded-2xl bg-zinc-100 px-5 dark:bg-zinc-900/20">
                {user !== null && isAuthor ? (
                  <span className="text-2xl font-semibold">
                    You can&apos;t review your own products!
                  </span>
                ) : (
                  <Button
                    className="text-2xl font-semibold"
                    variant="link"
                    asChild
                  >
                    <Link href="/sign-in">Login to write a review</Link>
                  </Button>
                )}
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
