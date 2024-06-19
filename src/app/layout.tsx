import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextProvider from "./clientWrappers/ContextProvider";
import ReactQueryClientProvider from "./clientWrappers/ReactQueryClientProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], fallback: ["Arial"] });

export const metadata: Metadata = {
  title: "Calendar Application",
  description:
    "Intra college calender application of Herald College Kathmandu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col`}>
        <Toaster />
        <ContextProvider>
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
