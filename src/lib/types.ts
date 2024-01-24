import { Prisma } from "@prisma/client";

const productWithImages = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: { images: true },
});
export type ProductWithImages = Prisma.ProductGetPayload<
  typeof productWithImages
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
  stock:number
};

export interface LocalShoppingCartItems {
  [index:string]: LocalShoppingCartItem
}

