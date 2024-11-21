import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";

export default function RootLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: { show_procurement: boolean };
}) {
  console.log(searchParams);
  return (
    <div className="flex">
      <Suspense>
        <Sidebar hasBreakpoint={true}></Sidebar>
        <div className="flex h-screen w-full flex-col">{children}</div>
      </Suspense>
    </div>
  );
}
