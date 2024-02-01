import { Prisma } from "@prisma/client";

const productWithImages = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: { images: { select: { url: true } } },
});

export type ProductWithImages = Prisma.ProductGetPayload<
  typeof productWithImages
>;
const productWithImagesAndVendor =
  Prisma.validator<Prisma.ProductDefaultArgs>()({
    include: {
      images: { select: { url: true } },
      vendor: { select: { name: true } },
    },
  });

export type ProductWithImagesAndVendor = Prisma.ProductGetPayload<
  typeof productWithImagesAndVendor
>;

const userWithShoppingCart = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    shoppingCartItems: { include: { product: { include: { images: true } } } },
  },
});

export type UserWithShoppingCart = Prisma.UserGetPayload<
  typeof userWithShoppingCart
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
