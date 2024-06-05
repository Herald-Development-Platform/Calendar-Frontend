import { NextResponse, type NextRequest } from "next/server";
import { decryptJwtPayload } from "./lib/utils";

export default function middleware(request: NextRequest) {
  if (!request.cookies.get("token")) {
    return NextResponse.redirect(
      new URL(`/login?from=${request.nextUrl.pathname}`, request.url),
    );
  }
  const data = decryptJwtPayload(request.cookies?.get("token")?.value || "");
  if (data.role && data.role!=="SUPER_ADMIN" && data.department) {
    const currentPath = request.nextUrl.pathname;
    console.log("currentPath", currentPath)
    if (currentPath.includes("selectDepartment") || currentPath.includes("login") || currentPath.includes("signup") || currentPath.includes("otp")) {
      return NextResponse.redirect(new URL(`/`, request.url));
  }
  if (data.role && data.role!=="SUPER_ADMIN" && !data.department) {
    return NextResponse.redirect(new URL(`/selectDepartment`, request.url));
  }
}
}
export const config = {
  matcher: ["/", "/search","/selectDepartment", "/otp"],
};
