/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
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

//data that defines the format of date and time for the calendar component.
// const locales = {
//   "en-US": US_LocaleData,
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// const events: eventType[] = [
//   {
//     title: "Big Meeting",
//     start: new Date(2023, 10, 22),
//     end: new Date(2023, 10, 23),
//   },
//   {
//     title: "event",
//     start: new Date(2023, 10, 22),
//     end: new Date(2023, 10, 24),
//   },
//   {
//     title: "Important Lecture",
//     start: new Date(2023, 11, 22),
//     end: new Date(2023, 11, 23),
//   },
// ];
export default function page() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="w-full">
      <div className="w-full">
        <Header date={date} setDate={setDate} />
      </div>
      <div className="relative flex max-w-full justify-between">
        <ReactBigCalendar date={date} setDate={setDate} />
        <UpcommingEvents />
      </div>
    </div>
  );
}
