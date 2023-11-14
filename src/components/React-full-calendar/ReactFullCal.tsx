import React, { useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Calendar from "@fullcalendar/core";
import { RefObject } from "@fullcalendar/core/preact.js";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { Context } from "@/app/ContextProvider";
import "./FullCalExtraCss.css";

export default function ReactFullCal({
  calendarRef,
}: {
  calendarRef: RefObject<FullCalendar | null>;
}) {
  const { events, setEvents } = useContext(Context);
  // console.log("cal component event :", events);

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
        events={events}
        headerToolbar={false}
        selectable={true}
        dateClick={(dateClickInfo) => {
          alert("clicked date: " + dateClickInfo.dateStr);
        }}
      />
    </div>
  );
}
