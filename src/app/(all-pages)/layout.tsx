import React from "react";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar hasBreakpoint={true}></Sidebar>
        <div className="flex h-screen w-full flex-col">{children}</div>
      </Suspense>
    </div>
  );
}
