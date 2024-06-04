import { NextResponse, type NextRequest } from "next/server";
import { decryptJwtPayload } from "./lib/utils";

export default function middleware(request: NextRequest) {
  if (!request.cookies.get("token")) {
    return NextResponse.redirect(
      new URL(`/login?from=${request.nextUrl.pathname}`, request.url),
    );
  }
  const data = decryptJwtPayload(request.cookies?.get("token")?.value || "");
  console.log(data);
  if (data.role && data.role!="SUPER_ADMIN" && !data.department) {
    return NextResponse.redirect(new URL(`/selectDepartment`, request.url));
  }
}

export const config = {
  matcher: ["/"],
};
