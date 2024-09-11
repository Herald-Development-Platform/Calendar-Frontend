import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar hasBreakpoint={true}></Sidebar>
      {/* <div>aslkdjf</div> */}
      <div className="flex h-screen w-full flex-col">{children}</div>
    </div>
  );
}
