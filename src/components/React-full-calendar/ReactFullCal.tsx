import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Calendar, { DateUnselectArg } from "@fullcalendar/core";
import { Context, ContextType } from "@/app/ContextProvider";
import "./FullCalExtraCss.css";

export default function ReactFullCal() {
  const { events, setEvents, calendarRef, setSelectedDate } =
    useContext(Context);

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
          setSelectedDate(dateClickInfo.date);
        }}
        unselect={(arg: DateUnselectArg) => {
          setSelectedDate(undefined);
        }}
        displayEventTime={false}
        dayHeaderClassNames={"customStylesDayHeader"}
        dayCellClassNames={"customStylesDayCells"}
        eventMaxStack={2}
        dayMaxEvents={1}
      />
    </div>
  );
}
