"use client";
import React, { useRef } from "react";
import "./styles.css";
import { format, lastDayOfMonth } from "date-fns";
export default function SemesterMonth({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
}: {
  year: number;
  month: number;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const firstDaysOfWeeks = getFirstDaysOfWeeks({ year: year, month: month });
  const lastMonthDate = getLastDayOfMonth({ year: year, month: month });
  const finalSectionLength =
    lastMonthDate -
    new Date(firstDaysOfWeeks[firstDaysOfWeeks.length - 1]).getDate() +
    1;

  console.log("lastMonthDate", lastMonthDate);
  console.log(
    "new Date(firstDaysOfWeeks[firstDaysOfWeeks.length - 1]).getDate()",
    new Date(firstDaysOfWeeks[firstDaysOfWeeks.length - 1]).getDate(),
  );
  console.log("finalSectionLength", finalSectionLength);
  console.log("firstDaysOfWeeks", firstDaysOfWeeks);

  // console.log("firstDaysOfWeeks", firstDaysOfWeeks);

  // console.log("year", year, "month", month, new Date(year, month));

  return (
    <>
      <div className="flex flex-col items-center">
        <h3>{format(new Date(year, month - 1), "MMMM")}</h3>
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
          {firstDaysOfWeeks.map((checkpointDays, i) => {
            const date = new Date(checkpointDays);
            const day = date.getDay();
            const gridSpanValue =
              i !== firstDaysOfWeeks.length - 1 ? 7 - day : finalSectionLength;

            // console.log(
            //   "finalSectionLength",
            //   finalSectionLength,
            //   finalSectionLength,
            // );

            return (
              <>
                {i === 0 &&
                  day !== 0 &&
                  [...Array(day)].map((_, i) => {
                    return (
                      <>
                        <div className="border border-red-500"></div>
                      </>
                    );
                  })}
                <div
                  className="border border-black"
                  style={{ gridColumn: `span ${gridSpanValue}` }}
                ></div>
                {i === firstDaysOfWeeks.length - 1 &&
                  finalSectionLength !== 7 &&
                  [...Array(7 - finalSectionLength)].map((_, i) => {
                    return (
                      <>
                        <div className="border border-red-500"></div>
                      </>
                    );
                  })}
              </>
            );
          })}
          {/* <div
            style={{ gridColumn: "span 7" }}
            className="border border-black"
          ></div>{" "}
          <div
            style={{ gridColumn: "span 7" }}
            className="border border-black"
          ></div>{" "}
          */}
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
function getLastDayOfMonth({ year, month }: { year: number; month: number }) {
  let date = new Date(year, month, 0);
  return date.getDate();
}

function getFirstDaysOfWeeks({ year, month }: { year: number; month: number }) {
  const firstDayOfWeek = [];

  let date = new Date(year, month - 1, 1);
  firstDayOfWeek.push(date.toISOString());
  console.log("date.getDay()", date.getDay());

  const daysTillUpcommingSunday = 7 - date.getDay();
  date.setDate(date.getDate() + daysTillUpcommingSunday);
  console.log("after set date", date);
  while (true) {
    firstDayOfWeek.push(date.toISOString());
    date.setDate(date.getDate() + 7);
    if (date.getMonth() !== month - 1) break;
  }
  return firstDayOfWeek;
}
