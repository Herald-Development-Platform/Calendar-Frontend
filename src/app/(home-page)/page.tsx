/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
// import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/sass/styles.scss";
// import "./react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import US_LocaleData from "date-fns/locale/en-US";
import { AiOutlinePlus } from "react-icons/ai";
import AddEventModal from "@/components/AddEventModal";
import UpcommingEvents from "@/components/UpcommingEvents";
import Header from "@/components/Header";
import ReactBigCalendar from "@/components/React-big-calendar";
import ReactFullCalendar from "@/components/React-full-calendar";
import FullCalendar from "@fullcalendar/react";

export default function page() {
  const [date, setDate] = useState(new Date());

  const calendarRef = useRef<FullCalendar | null>(null);

  return (
    <div className="h-full w-full">
      <div className="w-full">
        <Header date={date} setDate={setDate} />
      </div>

      <div className=" flex h-full w-full justify-between">
        <ReactFullCalendar />
        <UpcommingEvents />
      </div>
    </div>
  );
}
