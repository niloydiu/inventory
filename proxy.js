import { NextResponse } from "next/server";

const publicPaths = ["/login", "/register", "/"];

export function proxy(request) {
  const token = request.cookies.get("inventory_auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    if (token && pathname !== "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protect dashboard and other authenticated routes
  const protectedPrefixes = [
    "/dashboard",
    "/inventory",
    "/assignments",
    "/livestock",
    "/feeds",
    "/locations",
    "/users",
    "/maintenance",
    "/reservations",
    "/approvals",
    "/audit-logs",
    "/reports",
    "/settings",
  ];

  if (
    !token &&
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
