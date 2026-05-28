import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { authInstance } from "@/server/auth";

export async function proxy(request: NextRequest) {
  // Full session validation using Better Auth's API
  const session = await authInstance.api.getSession({
    headers: await headers(),
  });

  const url = request.nextUrl;

  // 1. If user is logged in and tries to access /sign-in, redirect to home
  if (url.pathname === "/sign-in" && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If user is NOT logged in and tries to access a protected route, redirect to sign-in
  if (!session && url.pathname !== "/sign-in") {
    return NextResponse.redirect(
      new URL(`/sign-in/?callback=${url.pathname}${url.search}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/add/:path*",
    "/sign-in/:path*",
    "/product/:path*/edit",
    "/checkout/:path*",
  ],
};
