"use client";

import { CERTIFICATE_URL } from "@/constants";
import React from "react";
import * as Headers from "@/components/Header";

const ProcurementPage = () => {
  return (
    <main className="h-screen overflow-hidden">
      <Headers.GeneralHeader />
      <iframe src={CERTIFICATE_URL} className="h-full w-full" />
    </main>
  );
};

export default ProcurementPage;
