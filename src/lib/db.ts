// import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";

const useNeon = process.env.USE_NEON === "true";
const connectionString = process.env.DATABASE_URL!;

let adapter: PrismaNeon | PrismaPg;
if (useNeon) {
  adapter = new PrismaNeon({ connectionString });
} else {
  adapter = new PrismaPg({ connectionString });
}

const prismaClientSingleton = new PrismaClient({
  adapter,
  // log: ["query", "error"],
}).$extends({
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
});

const globalForPrisma = globalThis as unknown as {
  prisma: typeof prismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
