/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useContext, useRef } from "react";
import "react-big-calendar/lib/sass/styles.scss";
import "react-datepicker/dist/react-datepicker.css";
import UpcommingEvents from "@/components/UpcommingEvents";
import * as Headers from "@/components/Header";
import ReactFullCalendar from "@/components/React-full-calendar";
import { useQuery } from "@tanstack/react-query";
import DepartmentButton from "@/components/DepartmentButton";
import DepartmentFilter from "@/components/utils/DepartmentFilter";
import { Context } from "../clientWrappers/ContextProvider";

export default function page() {
  const { data: departments } = useQuery<eventType[]>({
    queryKey: ["Departments"],
  });

  const depFilterRef = useRef<HTMLDivElement>(null);
  const { calendarRef } = useContext(Context);
  console.log(
    "depFilterRef.current?.offsetHeight",
    calendarRef?.current?.elRef?.current?.offsetHeight,
  );

  console.log(
    "getComputedStyle",
    depFilterRef.current && getComputedStyle(depFilterRef.current),
  );
  const calendarHeight = calendarRef?.current?.elRef?.current?.offsetHeight
    ? calendarRef?.current?.elRef?.current?.offsetHeight
    : 0;
  const UpEventsHeight = depFilterRef.current?.offsetHeight
    ? depFilterRef.current?.offsetHeight
    : 0;
  const UpEventsMarginY = depFilterRef.current
    ? parseInt(
        getComputedStyle(depFilterRef.current).marginTop +
          getComputedStyle(depFilterRef.current).marginTop,
      )
    : 0;

  // console.log(
  //   "total height",
  //   UpEventsMarginY + UpEventsHeight + calendarHeight,
  // );
  return (
    <div className="flex h-full w-full flex-col gap-8">
      <div className="w-full">
        <Headers.HomeHeader />
      </div>

      <div className="flex h-full w-full justify-between overflow-hidden overflow-y-auto">
        <div className="flex w-full flex-col">
          <DepartmentFilter ref={depFilterRef} />
          <ReactFullCalendar />
        </div>
        <UpcommingEvents
          elHeight={calendarHeight + UpEventsHeight + UpEventsMarginY}
        />
      </div>
    </div>
  );
}
