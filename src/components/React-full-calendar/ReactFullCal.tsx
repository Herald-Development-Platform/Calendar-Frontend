import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import Calendar, { DateUnselectArg } from "@fullcalendar/core";
import { Context, ContextType } from "@/app/clientWrappers/ContextProvider";
import "./FullCalExtraCss.css";
import { useQuery } from "@tanstack/react-query";
import { Axios, baseUrl } from "@/services/baseUrl";
import { getCookie } from "@/hooks/CookieHooks";
import Endpoints from "@/services/API_ENDPOINTS";

export default function ReactFullCal() {
  let timeout: any = null;
  const { calendarRef, setSelectedDate } = useContext(Context);
  // const [initialView, setInitialView] = useState<string>("dayGridMonth");

  const { data: eventsData } = useQuery({
    queryKey: ["Events"],
    queryFn: () => Axios.get(Endpoints.event),
  });

  // console.log("eventsData", eventsData);
  // const calendarApi = calendarRef?.current?.getApi();

  // console.log("calendarapi", calendarApi.currentV);

  return (
    <div className="h-full w-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          multiMonthPlugin,
          interactionPlugin,
          timeGridPlugin,
          listPlugin,
          multiMonthPlugin,
        ]}
        initialView={`dayGridMonth`}
        events={eventsData?.data?.data}
        headerToolbar={false}
        selectable={true}
        select={({ start, end, startStr, endStr }) => {
          setSelectedDate({ start, end, startStr, endStr });
          console.log("eventselect", { start, end, startStr, endStr });
          clearTimeout(timeout);
        }}
        // unselectAuto={true}
        unselect={(arg: DateUnselectArg) => {
          timeout = setTimeout(function () {
            console.log("arg", arg);
            setSelectedDate({
              start: new Date(),
              end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
            });
          }, 250);
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

// eventDragStart={(e) => {
//   console.log("eventDragStart", e);
// }}

// dateClick={(dateClickInfo) => {
//   console.log("dateclickinfo", dateClickInfo);
//   setSelectedDate(dateClickInfo?.date);
// }}
