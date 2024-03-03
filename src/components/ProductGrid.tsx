import ProductCard from "@/components/productCard";
import { ParamsType, ProductWithImagesAndVendor } from "@/lib/types";
import PaginationWrapper from "./PaginationWrapper";
import SortBy from "@/app/products/SortBy";
import FilterBy from "@/app/products/FilterBy";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";

export default async function ProductGrid({
  searchParams,
  params,
  className,
}: {
  searchParams: ParamsType;
  params: { vendorId: string | undefined; category: string | undefined };
  className?: string;
}) {
  const {
    sort = "new",
    page = "1",
    price = "0toInfinity",
    rating = "0to5",
    q,
  } = searchParams;
  const { vendorId, category } = params;
  // extract price bounds
  const [minPriceString, maxPriceString] = price.split("to");
  let minPrice = parseFloat(minPriceString);
  if (minPrice < 0 || isNaN(minPrice)) minPrice = 0;
  let maxPrice = parseFloat(maxPriceString);
  if (maxPrice < 0 || isNaN(maxPrice)) maxPrice = Infinity;

  // extract rating bounds
  const [minRatingString, maxRatingString] = rating.split("to");
  let minRating = parseFloat(minRatingString);
  if (minRating < 0 || isNaN(minRating)) minRating = 0;
  let maxRating = parseFloat(maxRatingString);
  if (maxRating < 0 || isNaN(maxRating)) maxRating = 5;

  let p = parseInt(page);
  if (p <= 0 || isNaN(p)) p = 1;

  const PRODUCTS_PER_PAGE = 12 as const;
  const pageOffset = p > 1 ? (p - 1) * PRODUCTS_PER_PAGE : 0;
  let orderByObject:
    | { createdAt: "asc" | "desc" }
    | { price: "asc" | "desc" }
    | { averageRating: "desc" };

  switch (sort) {
    case "rating":
      orderByObject = { averageRating: "desc" };
      break;
    case "new":
      orderByObject = { createdAt: "desc" };
      break;
    case "old":
      orderByObject = { createdAt: "asc" };
      break;
    case "price-to-high":
      orderByObject = { price: "asc" };
    case "price-to-low":
      orderByObject = { price: "desc" };
      break;
  }

  // AGGREGATIONS
  const productAggregationsPromise = prisma.product.aggregate({
    _min: { price: true, averageRating: true },
    _max: { price: true, averageRating: true },
  });
  const productCountPromise = prisma.product.count({
    where: {
      price:
        maxPrice === Infinity
          ? { gte: minPrice }
          : { gte: minPrice, lte: maxPrice },
      averageRating: { gte: minRating, lte: maxRating },
      name: { contains: q },
      vendorId,
      categories: { every: { name: category } },
    },
  });

  const productsPromise = prisma.product.findMany({
    where: {
      price:
        maxPrice === Infinity
          ? { gte: minPrice }
          : { gte: minPrice, lte: maxPrice },
      averageRating: { gte: minRating, lte: maxRating },
      name: { contains: q },
      vendorId,
      categories: { every: { name: category } },
    },
    take: PRODUCTS_PER_PAGE,
    orderBy: orderByObject,
    include: {
      images: { select: { url: true } },
      vendor: { select: { name: true } },
      _count: { select: { reviews: true } },
    },
    skip: pageOffset,
  });
  const [productAggregations, products, productCount] =
    await prisma.$transaction([
      productAggregationsPromise,
      productsPromise,
      productCountPromise,
    ]);
  const maxPageNum = Math.ceil(productCount / PRODUCTS_PER_PAGE);

  return (
    <div
      className={cn(
        "relative flex w-full flex-grow flex-col gap-1 py-5 lg:flex-row",
        className,
      )}
    >
      <aside className="sticky right-0 top-12 z-40 flex w-full min-w-max items-center gap-2 bg-zinc-50 px-1 py-1 dark:bg-zinc-950 lg:hidden">
        <FilterBy
          className="rounded-r-none bg-opacity-0 dark:bg-opacity-0"
          filters={{
            minPrice: productAggregations._min.price || 0,
            maxPrice: productAggregations._max.price || 0,
            minRating: productAggregations._min.averageRating || 0,
            maxRating: productAggregations._max.averageRating || 5,
          }}
        />
        <SortBy
          className="gap-4 rounded-l-none bg-opacity-0 dark:bg-opacity-0"
          currentSort={sort}
        />
      </aside>
      <FilterBy
        className="clip hidden lg:flex"
        filters={{
          minPrice: productAggregations._min.price || 0,
          maxPrice: productAggregations._max.price || 0,
          minRating: productAggregations._min.averageRating || 0,
          maxRating: productAggregations._max.averageRating || 5,
        }}
      />
      <div className="h-full w-full min-w-0 rounded-md bg-zinc-200 p-2 dark:bg-zinc-900">
        {q && (
          <h1 className="mb-2 text-3xl font-black">
            Found {productCount} matches for &quot;{q}&quot;
          </h1>
        )}
        <FilteredAndSortedProductList products={products} />
        <PaginationWrapper p={p} maxPageNum={maxPageNum} />
      </div>
      <SortBy className="hidden lg:flex" currentSort={sort} />
    </div>
  );
}

export function FilteredAndSortedProductList({
  products,
}: {
  products: ProductWithImagesAndVendor[];
}) {
  const productElements = products.map((product) => {
    return <ProductCard product={product} key={product.id} />;
  });
  if (productElements.length <= 0)
    return (
      <div className="flex h-[70dvh] flex-col items-center justify-center">
        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          No Products Found!
        </h1>
        <p className="text-3xl font-bold text-zinc-700 dark:text-zinc-400 md:text-4xl">
          check out our other stuff maybe?
        </p>
      </div>
    );
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 rounded-md @md:grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-4 @6xl:grid-cols-5 @7xl:grid-cols-6">
        {productElements}
      </div>
    </div>
  );
}
