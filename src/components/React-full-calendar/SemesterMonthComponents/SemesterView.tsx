"use client";
import SemesterMonth from "@/components/React-full-calendar/SemesterMonthComponents/SemesterMonth";
import { useGetEvents } from "@/services/api/eventsApi";
import React from "react";

export default function SemesterView({
  year,
  events,
}: {
  year: number;
  events: eventType[];
}) {
  // const year = new Date().getFullYear();
  //   const { data: eventsData } = useGetEvents();

  // console.log(
  //   " getParsedDateForSemView({ events: eventsData })",
  //   getParsedDateForSemView({ events: eventsData }),
  // );
  const eventsAccordingToMonth = getParsedDateForSemView({
    events: eventsData,
  });
  return (
    <>
      <div className="my-20 flex h-screen flex-wrap gap-5 overflow-y-scroll">
        {[...Array(12)].map((_, i) => {
          return (
            <>
              <SemesterMonth
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
