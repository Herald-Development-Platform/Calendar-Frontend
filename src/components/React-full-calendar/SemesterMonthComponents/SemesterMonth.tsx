"use client";
import React, { useRef } from "react";
import "./styles.css";
import { format, lastDayOfMonth } from "date-fns";
import { BsDot } from "react-icons/bs";

export default function SemesterMonth({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  events,
}: {
  year: number;
  month: number;
  events: eventType[];
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const firstDaysOfWeeks = getFirstDaysOfWeeks({ year: year, month: month });
  const lastMonthDate = getLastDayOfMonth({ year: year, month: month });
  const finalSectionLength =
    lastMonthDate -
    new Date(firstDaysOfWeeks[firstDaysOfWeeks.length - 1]).getDate() +
    1;

  // console.log("events", events);
  // console.log(
  //   "new Date(firstDaysOfWeeks[firstDaysOfWeeks.length - 1]).getDate()",
  //   new Date(firstDaysOfWeeks[firstDaysOfWeeks.length - 1]).getDate(),
  // );

  // console.log("finalSectionLength", finalSectionLength);
  // console.log("firstDaysOfWeeks", firstDaysOfWeeks);

  // console.log("firstDaysOfWeeks", firstDaysOfWeeks);
  // console.log("year", year, "month", month, new Date(year, month));

  return (
    <>
      <div className="flex flex-col items-center gap-[9px]">
        <h3 className="text-[18px] font-bold leading-[20px]">
          {format(new Date(year, month - 1), "MMMM")}
        </h3>
        <div ref={gridRef} className="sem-grid">
          <>
            <div className="leading[20px] flex  h-[22px] w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Sun
            </div>
            <div className="leading[20px] flex h-[22px]  w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Mon
            </div>
            <div className="leading[20px] flex  h-[22px] w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Tue
            </div>
            <div className="leading[20px] flex h-[22px]  w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Wed
            </div>
            <div className="h-[22px ] leading[20px] flex w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Thu
            </div>
            <div className="h-[22px ] leading[20px] flex w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Fri
            </div>
            <div className="h-[22px ] leading[20px] flex w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Sat
            </div>
          </>
          <>
            {firstDaysOfWeeks.map((checkpointDays, i) => {
              const date = new Date(checkpointDays);
              const day = date.getDay();
              const gridSpanValue =
                i !== firstDaysOfWeeks.length - 1
                  ? 7 - day
                  : finalSectionLength;

              // cosnt;
              let totalEvents = 0;

              events?.filter((event) => {
                let inFirstEdge = null;
                let inBetween = null;
                let inLastEdge = null;

                const eventStart = event?.start
                  ? new Date(event.start).getTime()
                  : 0;

                const eventEnd = event?.end ? new Date(event.end).getTime() : 0;

                const selectedStartTime = firstDaysOfWeeks[i]
                  ? new Date(firstDaysOfWeeks[i])?.getTime()
                  : 0;

                const selectedEndTime =
                  i === firstDaysOfWeeks.length - 1
                    ? new Date(year, month, 0).getTime()
                    : firstDaysOfWeeks[i + 1]
                    ? new Date(firstDaysOfWeeks[i + 1]).getTime()
                    : 0;

                inFirstEdge =
                  eventStart <= selectedStartTime &&
                  eventEnd > selectedStartTime;
                inBetween =
                  eventStart > selectedStartTime && eventEnd < selectedEndTime;
                inLastEdge =
                  eventStart < selectedEndTime && eventEnd >= selectedEndTime;
                month === 7 &&
                  console.log("events inside filter of july", selectedEndTime);

                if (!inFirstEdge && !inBetween && !inLastEdge) return;
                totalEvents++;
              });

              return (
                <>
                  {i === 0 &&
                    day !== 0 &&
                    [...Array(day)].map((_, i) => {
                      return (
                        <>
                          <div className="border-[0.5px] border-[#DDDDDD] bg-[#F1F1F1]"></div>
                        </>
                      );
                    })}

                  <div
                    className="flex flex-nowrap items-center overflow-hidden truncate border-[0.5px] border-[#DDDDDD] bg-[#ffffff] pl-5 text-xl text-neutral-600"
                    style={{ gridColumn: `span ${gridSpanValue}` }}
                  >
                    <span className="text-sm font-medium ">
                      {totalEvents} {gridSpanValue > 1 ? "Events" : "E..."}
                    </span>
                    {gridSpanValue > 2 && (
                      <>
                        <BsDot />
                        <span className="flex text-sm text-neutral-400">
                          {new Date(checkpointDays).getDate()}th -
                          {new Date(checkpointDays).getDate() +
                            gridSpanValue -
                            1}
                          th
                        </span>
                      </>
                    )}
                  </div>

                  {i === firstDaysOfWeeks.length - 1 &&
                    finalSectionLength !== 7 &&
                    [...Array(7 - finalSectionLength)].map((_, i) => {
                      return (
                        <>
                          <div className="border-[0.5px] border-[#DDDDDD] bg-[#F1F1F1]"></div>
                        </>
                      );
                    })}
                </>
              );
            })}
          </>
        </div>
      </div>
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
  // console.log("date.getDay()", date.getDay());

  const daysTillUpcommingSunday = 7 - date.getDay();
  date.setDate(date.getDate() + daysTillUpcommingSunday);
  // console.log("after set date", date);
  while (true) {
    firstDayOfWeek.push(date.toISOString());
    date.setDate(date.getDate() + 7);
    if (date.getMonth() !== month - 1) break;
  }
  return firstDayOfWeek;
}
