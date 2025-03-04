"use client";

import { PROCUREMENT_URL } from "@/constants";
import React from "react";
import * as Headers from "@/components/Header";

const ProcurementPage = ({ params }: { params: { id?: string[] } }) => {
  console.log(params);

  let path = params?.id ? `/${params.id.join("/")}` : "";

  if (path.trim().startsWith("/")) {
    path = path.trim().slice(1);
  }

  return (
    <main className="h-screen overflow-hidden">
      <Headers.GeneralHeader />
      <iframe
        src={`${PROCUREMENT_URL}/${decodeURIComponent(path)}`}
        className="h-full w-full"
      />
    </main>
  );
};

export default ProcurementPage;
