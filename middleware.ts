import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/admin/")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }
  return response;
}

export const config = { matcher: "/api/admin/:path*" };

