import "server-only";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = new PrismaClient({
  // log: ["query", "error"],
})
  .$extends({
    result: {
      product: {
        originalPrice: {
          needs: { price: true, discountPercentage: true },
          compute(product) {
            const discountDecimal = product.discountPercentage / 100;
            return product.price / (1 - discountDecimal);
          },
        },
      },
    },
  })
  .$extends(withAccelerate());

const globalForPrisma = globalThis as unknown as {
  prisma: typeof prismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
