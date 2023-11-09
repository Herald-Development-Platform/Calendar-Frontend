import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Calendar from "@fullcalendar/core";
import { RefObject } from "@fullcalendar/core/preact.js";
import { AiOutlineConsoleSql } from "react-icons/ai";

export default function ReactFullCal({
  calendarRef,
}: {
  calendarRef: RefObject<FullCalendar | null>;
}) {
  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };
  return (
    <div className="h-full w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[
          {
            title: "event1",
            start: new Date(),
          },
        ]}
        headerToolbar={false}
        selectable={true}
        dateClick={(dateClickInfo) => {
          alert("clicked date: " + dateClickInfo.dateStr);
        }}
      />
    </div>
  );
}
