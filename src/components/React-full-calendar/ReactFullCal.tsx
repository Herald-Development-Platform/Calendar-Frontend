import React, { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import Calendar, {
  DateSelectArg,
  DateUnselectArg,
  EventSourceInput,
} from "@fullcalendar/core";
import { Context, ContextType } from "@/app/clientWrappers/ContextProvider";
import "./FullCalExtraCss.css";
import { useQuery } from "@tanstack/react-query";
import { Axios, baseUrl } from "@/services/baseUrl";
import { getCookie } from "@/hooks/CookieHooks";
import Endpoints from "@/services/API_ENDPOINTS";
import { useGetEvents } from "@/services/api/eventsApi";

export default function ReactFullCal() {
  const { calendarRef, setSelectedDate, selectedDate, timeout, events } =
    useContext(Context);
  const calWrapper = useRef<HTMLDivElement>(null);
  // const { data: events } = useGetEvents();

  const handleSelect = ({ start, end, startStr, endStr }: DateSelectArg) => {
    setSelectedDate({ start, end, startStr, endStr });
    console.log("eventselect", { start, end, startStr, endStr });
    clearTimeout(timeout.current);
  };

  const handleUnselect = (arg: DateUnselectArg) => {
    timeout.current = setTimeout(function () {
      console.log("arg", arg);
      setSelectedDate({
        start: new Date(),
        end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
      });
    }, 250);
  };

  useEffect(() => {
    if (!calWrapper.current) return;
    const dotEvents = calWrapper.current.querySelectorAll(
      ".fc-daygrid-event.fc-daygrid-dot-event",
    );

    console.log("dotEvents", dotEvents);

    if (dotEvents.length === 0) return;

    const dotEventsArray = Array.from(dotEvents);

    dotEventsArray?.map((dotEvent: any) => {
      if (dotEvent.querySelector(".department-wrapper")) return;
      const titleElement = dotEvent.querySelector(".fc-event-title");
      const correctEventDepartments = events?.find(
        (event: eventType) => event.title === titleElement.textContent,
      )?.departments;

      const departmentsWrapper = document.createElement("div");
      departmentsWrapper.classList.add("department-wrapper");

      correctEventDepartments?.map((department: any, i: number) => {
        console.log("department", department);

        const departmentElement = document.createElement("div");
        departmentElement.classList.add("department-item");
        departmentElement.textContent = department?.code;
        if (i === 0) {
          departmentElement.style.backgroundColor = "#A3A3A3";
        } else {
          departmentElement.style.backgroundColor = "#F5F5F5";
          departmentElement.style.color = "#A3A3A3";
        }
        departmentsWrapper.appendChild(departmentElement);
      });
      dotEvent?.insertBefore(departmentsWrapper, titleElement);

      // console.log("dotEvent", dotEvent);
      return;
    });
  }, [selectedDate, events]);

  return (
    <>
      <div ref={calWrapper} className="h-full w-full">
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
          events={events as EventSourceInput}
          eventMouseEnter={(info) => {
            const tooltipWrapper = document.createElement("div");
            tooltipWrapper.innerText = info.event._def.title;
            tooltipWrapper.classList.add("event-tooltip");
            info.el.appendChild(tooltipWrapper);
            tooltipWrapper.classList.add("event-tooltip-transition");
          }}
          eventMouseLeave={(info) => {
            const tooltipEl = info?.el?.querySelector(".event-tooltip");

            if (!tooltipEl) return;
            tooltipEl.remove();
          }}
          headerToolbar={false}
          selectable={true}
          select={handleSelect}
          unselect={handleUnselect}
          displayEventTime={false}
          dayHeaderClassNames={"customStylesDayHeader"}
          dayCellClassNames={"customStylesDayCells"}
          eventMaxStack={2}
          dayMaxEvents={4}
        />
      </div>
    </>
  );
}

// eventDragStart={(e) => {
//   console.log("eventDragStart", e);
// }}

// dateClick={(dateClickInfo) => {
//   console.log("dateclickinfo", dateClickInfo);
//   setSelectedDate(dateClickInfo?.date);
// }}

// views={{
//   dayGridMonth: {
//     dayMaxEventRows: 3,
//     eventLimit: 3,
//   },
// }}
// eventLimit={true}

// eventDidMount={(info) => {
//   console.log("info", info);
// }}
