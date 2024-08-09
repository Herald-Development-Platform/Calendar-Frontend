"use client";
import { Context } from "@/app/clientWrappers/ContextProvider";
import SemesterMonth from "@/components/React-full-calendar/SemesterMonthComponents/SemesterMonth";
import { useGetEvents } from "@/services/api/eventsApi";
import React, { useContext, useEffect, useRef } from "react";

export default function SemesterView({
  year,
  events,
}: {
  year: number;
  events: eventType[];
}) {
  console.log("SemesterViewSemesterView", year);
  const eventsAccordingToMonth = getParsedDateForSemView({
    events,
  });
  const semViewRef = useRef<HTMLDivElement>(null);
  const { selectedDate } = useContext(Context);
  const selMonthIndex = selectedDate?.start?.getMonth();
  console.log("selMonthIndex", selMonthIndex);

  useEffect(() => {
    const selEl = semViewRef.current?.querySelector(`#month-${selMonthIndex}`);
    console.log("semViewRef", selEl);

    setTimeout(() => {
      selEl?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }, 200);

    // @ts-ignore
    // const selMonthEl = semViewRef.current?.getElementById(`#${selMonthIndex}`);
  }, [semViewRef]);

  return (
    <>
      <div
        ref={semViewRef}
        className="hide-scrollbar mx-auto flex h-[calc(100vh-165px)] w-fit flex-wrap justify-center gap-5 overflow-y-scroll pb-20"
      >
        {[...Array(12)].map((_, i) => {
          return (
            <>
              <SemesterMonth
                key={i}
                year={year}
                month={i + 1}
                events={eventsAccordingToMonth[i]}
              ></SemesterMonth>
            </>
          );
        })}
      </div>
    </>
  );
}

function getParsedDateForSemView({
  events,
}: {
  events: eventType[] | undefined;
}) {
  const dateObj: any = {};
  events?.forEach((event: eventType) => {
    if (!event?.start) return;

    const monthIndex =
      (event?.start && new Date(event?.start)?.getMonth()) || -1;

    !Array.isArray(dateObj[monthIndex])
      ? (dateObj[monthIndex] = [event])
      : dateObj[monthIndex].push(event);

    const monthEndIndex =
      (event?.end && new Date(event?.end)?.getMonth()) || -1;

    if (monthEndIndex !== monthIndex) {
      !Array.isArray(dateObj[monthEndIndex])
        ? (dateObj[monthEndIndex] = [event])
        : dateObj[monthEndIndex].push(event);
    }
  });

  return dateObj;
}
