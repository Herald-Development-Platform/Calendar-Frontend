"use client";

import { PROCUREMENT_URL } from "@/constants";
import React from "react";
import * as Headers from "@/components/Header";

const ProcurementPage = () => {
  return (
    <main>
      <Headers.GeneralHeader />
      <iframe src={PROCUREMENT_URL} className="h-screen w-full" />
    </main>
  );
};

export default ProcurementPage;
