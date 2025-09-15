import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ContextProvider from "./clientWrappers/ContextProvider";
import ReactQueryClientProvider from "./clientWrappers/ReactQueryClientProvider";
import { Toaster } from "react-hot-toast";
import WebSocketProvider from "./clientWrappers/WebSocketProvider";

const inter = Inter({ subsets: ["latin"], fallback: ["Arial"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700","800", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Calendar Application",
  description: "Intra college calender application of Herald College Kathmandu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className} flex flex-col`}>
        <Toaster />
        <ReactQueryClientProvider>
          <ContextProvider>
            <WebSocketProvider>{children}</WebSocketProvider>
          </ContextProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
