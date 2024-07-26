"use client";
import React, { useRef } from "react";
import "./styles.css";
export default function SemesterMonth({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
}: {
  year: number;
  month: number;
}) {
  // const date = new Date("");
  const gridRef = useRef<HTMLDivElement>(null);
  console.log("date", getFirstDayOfMonth(2024, 1));
  // console.log("date", new Date().getDay());

  return (
    <>
      <div className="flex flex-col items-center">
        <h3>January</h3>
        <div ref={gridRef} className="sem-grid">
          <>
            <div className="h-10 w-full border border-[#dddddd]">Sun</div>
            <div className="h-10 w-full border border-[#dddddd]">Mon</div>
            <div className="h-10 w-full border border-[#dddddd]">Tue</div>
            <div className="h-10 w-full border border-[#dddddd]">Wed</div>
            <div className="h-10 w-full border border-[#dddddd]">Thu</div>
            <div className="h-10 w-full border border-[#dddddd]">Fri</div>
            <div className="h-10 w-full border border-[#dddddd]">Sat</div>
          </>
          {/* <div
            style={{ gridColumn: "span 7" }}
            className="border border-black"
          ></div>{" "}
          <div
            style={{ gridColumn: "span 7" }}
            className="border border-black"
          ></div>{" "}
          <div
            style={{ gridColumn: "span 7" }}
            className="border border-black"
          ></div>
          <div
            style={{ gridColumn: "span 7" }}
            className="border border-black"
          ></div>{" "}
          <div
            style={{ gridColumn: "span 7" }}
            className="border border-black"
          ></div>{" "}
          <div
            style={{ gridColumn: "span 7" }}
            className="border border-black"
          ></div> */}
          {/* <div className="h-40 w-10   ">Sat</div> */}
        </div>
      </div>
      {/* <button
        onClick={() => {
          gridRef.current?.appendChild();
        }}
      >
        Append Month
      </button> */}
    </>
  );
}

function getFirstDayOfMonth(year: number, month: number) {
  // Create a new Date object for the first day of the given month
  const date = new Date(year, month - 1, 1); // month is 0-based
  return date.getDay(); // getDay() returns the day of the week (0-6)
}
