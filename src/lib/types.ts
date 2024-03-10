import { Prisma } from "@prisma/client";

const productWithImages = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: { images: { select: { url: true } } },
});

export type ProductWithImages = Prisma.ProductGetPayload<
  typeof productWithImages
>;

const productWithImagesAndCategories =
  Prisma.validator<Prisma.ProductDefaultArgs>()({
    include: { images: { select: { url: true } }, categories: true },
  });

export type ProductWithImagesAndCategories = Prisma.ProductGetPayload<
  typeof productWithImagesAndCategories
>;

// #TODO change name to have reviews as well
const productWithImagesAndVendor =
  Prisma.validator<Prisma.ProductFindManyArgs>()({
    include: {
      images: { select: { url: true } },
      vendor: { select: { name: true } },
      _count: { select: { reviews: true } },
    },
  });

export type ProductWithImagesAndVendor = Prisma.ProductGetPayload<
  typeof productWithImagesAndVendor
> & { originalPrice: number };

const userWithShoppingCart = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    shoppingCartItems: { include: { product: { include: { images: true } } } },
  },
});

export type UserWithShoppingCart = Prisma.UserGetPayload<
  typeof userWithShoppingCart
>;

const userWithShoppingCartAndVendor =
  Prisma.validator<Prisma.UserDefaultArgs>()({
    include: {
      shoppingCartItems: {
        include: { product: { include: { images: true } } },
      },
      vendor: true,
    },
  });

export type UserWithShoppingCartAndVendor = Prisma.UserGetPayload<
  typeof userWithShoppingCartAndVendor
>;

export type LocalShoppingCartItem = {
  productId: string;
  quantity: number;
  name: string;
  image: string;
  price: number;
  stock: number;
};

export interface LocalShoppingCartItems {
  [index: string]: LocalShoppingCartItem;
}

export type ParamsType = {
  page: string | undefined;
  sort: "new" | "old" | "price-to-low" | "price-to-high" | "rating" | undefined;
  price: `${string}to${string}` | undefined;
  rating: `${string}to${string}` | undefined;
  q: string | undefined;
};
