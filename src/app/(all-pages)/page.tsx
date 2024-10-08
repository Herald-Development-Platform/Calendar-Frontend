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
  const calLayoutRef = useRef<HTMLDivElement>(null);
  const calContainerRef = useRef<HTMLDivElement>(null);

  const { calendarRef } = useContext(Context);
  // @ts-ignore
  const calendarHeight = calendarRef?.current?.elRef?.current?.offsetHeight
    ? // @ts-ignore
      calendarRef?.current?.elRef?.current?.offsetHeight
    : 0;
  const DepFilHeight = depFilterRef.current?.offsetHeight
    ? depFilterRef.current?.offsetHeight
    : 0;
  const DepFilMarginY = depFilterRef.current
    ? parseInt(
        getComputedStyle(depFilterRef.current).marginTop +
          getComputedStyle(depFilterRef.current).marginTop,
      )
    : 0;

  const calLayoutWidth = calLayoutRef.current?.offsetWidth || 0;
  const calContainerWidth = calContainerRef.current?.offsetWidth || 0;
  const eventDetailWidth = calLayoutWidth - calContainerWidth - 56;

  console.log("eventDetailWidth", eventDetailWidth);
  return (
    <div className="flex h-full w-full flex-col gap-8">
      <div className="w-full">
        <Headers.HomeHeader />
      </div>
      <div
        ref={calLayoutRef}
        className="relative flex h-full w-full justify-between overflow-hidden overflow-y-auto pl-8"
      >
        <div ref={calContainerRef} className="flex h-fit w-full flex-col">
          <DepartmentFilter ref={depFilterRef} />
          <div className="w-full overflow-x-scroll hide-scrollbar">
            <ReactFullCalendar />
          </div>
        </div>
        <UpcommingEvents
          elHeight={calendarHeight + DepFilHeight + DepFilMarginY}
        />
      </div>
    </div>
  );
}
