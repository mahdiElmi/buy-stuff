import { auth } from "@/server/auth";
// export { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  // console.log("I happened", session, req.nextUrl, req.url);
  if (req.nextUrl.pathname === "/sign-in" && session)
    return NextResponse.redirect(new URL("/", req.url));
  if (!session && req.nextUrl.pathname !== "/sign-in")
    return NextResponse.redirect(
      new URL(
        `/sign-in/?callback=${req.nextUrl.pathname}${req.nextUrl.search}`,
        req.url,
      ),
    );
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard/:path*",
    "/products/add/:path*",
    "/sign-in/:path*",
    "/product/:path/edit",
  ],
};

// import { NextResponse } from "next/server";

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL("/home", request.url));
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/about/:path*",
// };
