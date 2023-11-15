import React, { useContext, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Calendar, { DateUnselectArg } from "@fullcalendar/core";
import { RefObject } from "@fullcalendar/core/preact.js";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { Context } from "@/app/ContextProvider";
import "./FullCalExtraCss.css";

export default function ReactFullCal() {
  //   {
  //   calendarRef,
  // }: {
  //   calendarRef: RefObject<FullCalendar | null>;
  // }
  const { events, setEvents, calendarRef, setSelectedDate } =
    useContext(Context);
  // console.log("cal component event :", events);
  return (
    <div className="h-full w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={false}
        selectable={true}
        dateClick={(dateClickInfo) => {
          console.log("clicked date: " + dateClickInfo.dateStr);
          setSelectedDate(dateClickInfo.date);
        }}
        unselect={(arg: DateUnselectArg) => {
          console.log("unselected -----------------------");
          console.log("arg", arg);
          setSelectedDate(undefined);
        }}
        displayEventTime={false}
      />
    </div>
  );
}
