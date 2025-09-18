import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login" && pathname !== "/admin/register") {
      if (!token || !token.user || token.user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.nextUrl));
      }
    }
  }
  if (pathname.startsWith("/user")) {
    if (!token || !token.user || !token.user.staffid) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token && token.user && token.user.staffid) {
      return NextResponse.redirect(new URL("/user", req.nextUrl));
    }
  }
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/register")
  ) {
    if (token && token.user && token.user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
  }
}
