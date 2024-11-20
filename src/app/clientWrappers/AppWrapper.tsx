"use client";

import { PROCUREMENT_URL } from "@/constants";
import { useSearchParams } from "next/navigation";
import React from "react";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  return (
    <>
      {searchParams.get("show_procurement") ? (
        <iframe src={PROCUREMENT_URL} className="h-screen w-full" />
      ) : (
        children
      )}
    </>
  );
};

export default AppWrapper;
