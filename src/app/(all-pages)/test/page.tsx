import SemesterMonth from "@/components/React-full-calendar/SemesterMonthComponents/SemesterMonth";
import React from "react";

export default function Page() {
  return (
    <div>
      <SemesterMonth year={2024} month={5}></SemesterMonth>
    </div>
  );
}
