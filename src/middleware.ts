import { authMiddleware } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/products",
    "/blog",
    "/product",
    "/product/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
