import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = new PrismaClient({
  // log: ["query"],
}).$extends(withAccelerate());
type PrismaClientSingleton = typeof prismaClientSingleton;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton;

//type PrismaClientSingleton = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
