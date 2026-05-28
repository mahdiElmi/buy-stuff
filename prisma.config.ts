import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL, // used for migrations
  },
  migrations: {
    seed: "bun prisma/seed.ts",
  },
});
