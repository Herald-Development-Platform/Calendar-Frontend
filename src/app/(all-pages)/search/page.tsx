"use client";
import React from "react";
import * as Headers from "@/components/Header";
import RecentSearches from "@/components/RecentSearches/RecentSearches";

export default function page() {
  return (
    <div className="flex flex-col gap-9">
      <Headers.SearchHeader />
      <RecentSearches />
    </div>
  );
}
