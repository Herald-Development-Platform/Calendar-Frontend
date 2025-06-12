"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PROCUREMENT_URL } from "@/constants";
import * as Headers from "@/components/Header";

const ProcurementPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const lastPushedPathRef = useRef(pathname);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const iframePath =
    pathname === "/procurement" ? "/" : pathname.replace(/^\/procurement/, "");
  const fullIframeUrl = `${PROCUREMENT_URL}${iframePath}`;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "IFRAME_ROUTE_CHANGE") {
        const iframeNewPath = event.data.path;
        const expectedNextPath = `/procurement${iframeNewPath}`;

        if (expectedNextPath !== lastPushedPathRef.current) {
          lastPushedPathRef.current = expectedNextPath;
          router.push(expectedNextPath);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  const handleIframeLoad = () => {
    console.log("[IFRAME LOADED]");
  };

  return (
    <main className="h-screen overflow-hidden">
      <Headers.GeneralHeader className="absolute -left-20 top-0 w-full" />
      <iframe
        ref={iframeRef}
        src={fullIframeUrl}
        className="h-full w-full"
        title="Procurement App"
        onLoad={handleIframeLoad}
      />
    </main>
  );
};

export default ProcurementPage;
