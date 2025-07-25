import { NextResponse, type NextRequest } from "next/server";
import { decryptJwtPayload } from "./lib/utils";

export default function middleware(request: NextRequest) {
  if (!request.cookies.get("token")) {
    return NextResponse.redirect(
      new URL(
        `${process.env.DOMAIN_PREFIX || ""}/login?from=${request.nextUrl.pathname}`,
        request.url
      )
    );
  }
  const data = decryptJwtPayload(request.cookies?.get("token")?.value || "");
  if (data.role && data.role !== "SUPER_ADMIN" && data.department) {
    const currentPath = request.nextUrl.pathname;
    if (
      currentPath.includes("selectDepartment") ||
      currentPath.includes("login") ||
      currentPath.includes("signup") ||
      currentPath.includes("otp")
    ) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }
  }
  if (data.role && data.role !== "SUPER_ADMIN" && !data.department) {
    if (!request.nextUrl.pathname.includes("selectDepartment")) {
      return NextResponse.redirect(
        new URL(`${process.env.DOMAIN_PREFIX || ""}/selectDepartment`, request.url)
      );
    }
  }
}
export const config = {
  matcher: ["/", "/search", "/selectDepartment", "/members"],
};
