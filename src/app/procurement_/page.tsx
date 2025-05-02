"use client";

import { PROCUREMENT_URL } from "@/constants";
import React from "react";
import * as Headers from "@/components/Header";

const ProcurementPage = () => {
  return (
    <main className="h-screen overflow-hidden">
      <Headers.GeneralHeader className="absolute -left-20 top-0 w-full" />
      <iframe src={PROCUREMENT_URL} className="h-full w-full" />
    </main>
  );
};

export default ProcurementPage;
