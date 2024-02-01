import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/db";
import { ProductWithImagesAndVendor } from "@/lib/types";
import { Prisma, Product } from "@prisma/client";
import SortBy from "./SortBy";
import PaginationWrapper from "@/components/PaginationWrapper";
import FilterBy from "./FilterBy";

type ParamsType = {
  page: string | undefined;
  sort: "new" | "old" | "price-to-low" | "price-to-high" | "rating" | undefined;
  price: `${string}to${string}` | undefined;
  rating: `${string}to${string}` | undefined;
};

export default async function Products({
  searchParams,
}: {
  searchParams: ParamsType;
}) {
  const {
    sort = "new",
    page = "1",
    price = "0toInfinity",
    rating = "0to5",
  } = searchParams;
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
  let orderByObject: { createdAt: "asc" | "desc" } | { price: "asc" | "desc" } =
    { createdAt: "desc" };

  switch (sort) {
    case "old":
      orderByObject = { createdAt: "asc" };
      break;
    case "new":
      orderByObject = { createdAt: "desc" };
      break;
    case "price-to-low":
      orderByObject = { price: "desc" };
      break;
    case "price-to-high":
      orderByObject = { price: "asc" };
      break;
  }

  let products: (ProductWithImagesAndVendor & {
    _averageRating?: number;
  })[] = [];
  let productCount: number;
  let maxPageNum: number;

  if (sort !== "rating") {
    const productCountToFlush = prisma.product.count({
      where: {
        price:
          maxPrice === Infinity
            ? { gte: minPrice }
            : { gte: minPrice, lte: maxPrice },
      },
    });
    const productsToFlush = prisma.product.findMany({
      where: {
        price:
          maxPrice === Infinity
            ? { gte: minPrice }
            : { gte: minPrice, lte: maxPrice },
      },
      take: PRODUCTS_PER_PAGE,
      orderBy: orderByObject,
      include: {
        images: { select: { url: true } },
        vendor: { select: { name: true } },
      },
      skip: pageOffset,
    });
    const [returnedProducts, productCountFromDB] = await prisma.$transaction([
      productsToFlush,
      productCountToFlush,
    ]);
    products = returnedProducts;
    productCount = productCountFromDB;
  } else {
    const rawProductsSortedByRatingToFlush: Prisma.PrismaPromise<
      (Product & {
        image_urls: string;
        vendorName: string;
        _averageRating: number;
        _count: number;
      })[]
    > = prisma.$queryRaw`        
    SELECT
        p.*,
        v.name AS vendorName,
        COALESCE(AVG(r.rating), 0) AS _averageRating,
        GROUP_CONCAT(i.url) AS image_urls
    FROM
        Product p
    LEFT JOIN
        Review r ON p.id = r.productId
    LEFT JOIN
        Image i ON p.id = i.productId
    LEFT JOIN
        Vendor v ON p.vendorId = v.id
    WHERE p.price >= ${minPrice} AND p.price <= ${maxPrice === Infinity ? 999999999999999 : maxPrice}
    GROUP BY
        p.id
    HAVING _averageRating >= ${minRating} AND _averageRating <= ${maxRating}
    ORDER BY
        _averageRating DESC
    Limit ${pageOffset}, ${PRODUCTS_PER_PAGE}`;

    // COUNT QUERY
    const productCountToFlush: Prisma.PrismaPromise<
      [{ product_count: bigint }]
    > = prisma.$queryRaw`
    SELECT COUNT(*) AS product_count
    FROM (
      SELECT 
        p.id,
        COALESCE(AVG(r.rating), 0) AS _averageRating  
      FROM Product p
      LEFT JOIN Review r ON p.id = r.productId
      WHERE p.price >= ${minPrice} AND p.price <= ${maxPrice === Infinity ? 999999999999999 : maxPrice} 
      GROUP BY p.id
      HAVING _averageRating >= ${minRating} AND _averageRating <= ${maxRating}
    ) AS subquery;`;
    const [rawProductsSortedByRating, productCountFromDB] =
      await prisma.$transaction([
        rawProductsSortedByRatingToFlush,
        productCountToFlush,
      ]);
    console.log({ productCountFromDB });
    productCount = Number(productCountFromDB[0].product_count);

    products = rawProductsSortedByRating.map((row) => {
      const imageUrls = row.image_urls.split(",").map((url) => ({ url }));
      const newObj = {
        ...row,
        images: imageUrls,
        vendor: { name: row.vendorName },
      };
      return newObj;
    });
  }
  console.log(
    { productCount, PRODUCTS_PER_PAGE },
    productCount / PRODUCTS_PER_PAGE,
  );
  maxPageNum = Math.ceil(productCount / PRODUCTS_PER_PAGE);

  return (
    <div className="relative flex w-full flex-grow gap-1 self-start py-5">
      <FilterBy filters={{ minPrice, maxPrice, minRating, maxRating }} />
      <div className="h-full w-full flex-grow rounded-md bg-zinc-200 p-2 dark:bg-zinc-900">
        <ProductGrid products={products} />
        <PaginationWrapper p={p} maxPageNum={maxPageNum} />
      </div>
      <SortBy currentSort={sort} />
    </div>
  );
}
