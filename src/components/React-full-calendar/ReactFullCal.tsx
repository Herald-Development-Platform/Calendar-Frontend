import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Calendar, { DateUnselectArg } from "@fullcalendar/core";
import { Context, ContextType } from "@/app/clientWrappers/ContextProvider";
import "./FullCalExtraCss.css";
import { useQuery } from "@tanstack/react-query";
import { Axios, baseUrl } from "@/services/baseUrl";
import { getCookie } from "@/hooks/CookieHooks";
import Endpoints from "@/services/API_ENDPOINTS";

export default function ReactFullCal() {
  const { calendarRef } = useContext(Context);

  const { data: eventsData } = useQuery({
    queryKey: ["Events"],
    queryFn: () => Axios.get(Endpoints.event),
  });
  console.log("eventsData", eventsData);
  return (
    <div className="h-full w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={eventsData?.data?.data}
        headerToolbar={false}
        selectable={true}
        // dateClick={(dateClickInfo) => {
        //   setSelectedDate(dateClickInfo.date);
        // }}
        // unselect={(arg: DateUnselectArg) => {
        //   setSelectedDate(undefined);
        // }}
        displayEventTime={false}
        dayHeaderClassNames={"customStylesDayHeader"}
        dayCellClassNames={"customStylesDayCells"}
        eventMaxStack={2}
        dayMaxEvents={1}
      />
    </div>
  );
}
