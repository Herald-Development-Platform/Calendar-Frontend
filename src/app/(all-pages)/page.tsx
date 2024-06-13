/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useRef, useState } from "react";
import "react-big-calendar/lib/sass/styles.scss";
import "react-datepicker/dist/react-datepicker.css";
import UpcommingEvents from "@/components/UpcommingEvents";
import * as Headers from "@/components/Header";
import ReactFullCalendar from "@/components/React-full-calendar";
import FullCalendar from "@fullcalendar/react";

export default function page() {
  const [date, setDate] = useState(new Date());

  const calendarRef = useRef<FullCalendar | null>(null);

  return (
    <div className="flex h-full w-full flex-col gap-8">
      <div className="w-full">
        <Headers.HomeHeader />
      </div>

      <div className=" flex h-full w-full justify-between overflow-hidden overflow-y-auto">
        <ReactFullCalendar />
        <UpcommingEvents />
      </div>
    </div>
  );
}
