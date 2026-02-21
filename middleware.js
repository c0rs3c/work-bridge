import { NextResponse } from "next/server";

const protectedMap = {
  "/admin": "admin",
  "/executive": "executive",
  "/supplier": "supplier",
  "/demand": "demand"
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const matchedRoot = Object.keys(protectedMap).find((root) => pathname.startsWith(root));
  if (!matchedRoot) return NextResponse.next();

  const role = request.cookies.get("lc_role")?.value;
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const requiredRole = protectedMap[matchedRoot];
  if (role !== requiredRole && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/executive/:path*", "/supplier/:path*", "/demand/:path*"]
};
