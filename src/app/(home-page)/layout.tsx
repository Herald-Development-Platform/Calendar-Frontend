import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex ">
      <Sidebar></Sidebar>
      <div className="w-full">{children}</div>
    </div>
  );
}
