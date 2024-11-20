import Sidebar from "@/components/Sidebar";
import { PROCUREMENT_URL } from "@/constants";
import AppWrapper from "../clientWrappers/AppWrapper";

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
      <Sidebar hasBreakpoint={true}></Sidebar>
      <div className="flex h-screen w-full flex-col">
        <AppWrapper>{children}</AppWrapper>
      </div>
    </div>
  );
}
