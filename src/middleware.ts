import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

const isPublicRoutes = createRouteMatcher([
  "/site",
  "/api/uploading",
  "/api/stripe/webhook",
]);

// export default clerkMiddleware();
export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  if (isPublicRoutes(req) || url.pathname.startsWith("/api/uploadthing")) {
    return NextResponse.next();
  }
  const searchParams = url.searchParams.toString();
  let hostname = req.headers;

  const pathWithSearchParams = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  const customSubDomain = hostname
    .get("host")
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
    );
  }

  if (
    url.pathname === "/" ||
    (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }
  if (url.pathname === "/agency" || url.pathname === "/subaccount") {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }
  if (!isPublicRoutes(req)) {
    const { userId } = await auth();
    if (!userId) await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
