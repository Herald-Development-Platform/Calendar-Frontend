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
  EventHoveringArg,
  EventMountArg,
  EventSourceInput,
} from "@fullcalendar/core";
import { Context, ContextType } from "@/app/clientWrappers/ContextProvider";
import "./FullCalExtraCss.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios, baseUrl } from "@/services/baseUrl";
import { getCookie, setCookie } from "@/hooks/CookieHooks";
import Endpoints from "@/services/API_ENDPOINTS";
import { useGetEvents } from "@/services/api/eventsApi";
import { parse, format } from "date-fns";
import { generateNewToken } from "@/lib/utils";

const allPlugins = [
  dayGridPlugin,
  multiMonthPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
  multiMonthPlugin,
];

export default function ReactFullCal() {
  const { calendarRef, setSelectedDate, selectedDate, timeout, events, users } =
    useContext(Context);
  const calWrapper = useRef<HTMLDivElement>(null);
  const dayFrameRefs = useRef<HTMLDivElement[]>([]);

  const monthValue = calendarRef?.current?.getApi().getDate().getMonth();

  const queryClient = useQueryClient();
  const { mutate: updateHighLightedEvents } = useMutation({
    mutationFn: (payload: any) => Axios.patch("/profile", payload),
  });

  const { data: userData } = useQuery({
    queryKey: ["ProfileData"],
    // queryFn: async () => await Axios.get(Endpoints.profile),
    queryFn: async () => {
      try {
        const response = await Axios.get(`/profile`);
        const user = response.data.data;
        const token = await generateNewToken();
        if (token) {
          setCookie("token", token, 5);
        }
        return user;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
  });
  // console.log(
  //   " calendarRef?.current",
  //   calendarRef?.current?.getApi().getDate().getMonth(),
  // );

  const handleSelect = ({ start, end, startStr, endStr }: DateSelectArg) => {
    setSelectedDate({ start, end, startStr, endStr });
    // console.log("eventselect", { start, end, startStr, endStr });
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
    if (!calendarRef.current) return;

    dayFrameRefs.current = calendarRef.current.elRef.current.querySelectorAll(
      ".fc-daygrid-day-frame",
    );
    const dayFrameEls = Array.from(dayFrameRefs.current);

    // console.log("dayFrameRefs.current", dayFrameEls);
    const listenerRefs: any[] = [];

    if (!Array.isArray(dayFrameEls)) return;

    dayFrameEls.map((dayFrameEl: HTMLDivElement) => {
      // console.log("dayFrameEl", dayFrameEl);
      const topEl = dayFrameEl.querySelector(".fc-daygrid-day-number");
      const ariaLabelValue = topEl?.getAttribute("aria-label");
      if (!ariaLabelValue) return;
      const parsedDate = parse(ariaLabelValue, "MMMM d, yyyy", new Date());
      const isoDate = format(parsedDate, "yyyy-MM-dd");
      // console.log("isoDate", new Date(isoDate).toISOString());

      const isHighLight = userData?.importantDates.includes(
        new Date(isoDate).toISOString(),
      );
      if (isHighLight) dayFrameEl.style.backgroundColor = "#fffdc3";
      else dayFrameEl.style.backgroundColor = "#ffffff";

      const contextMenuListener = (e: any) => {
        e.preventDefault();

        const contextWrapper = document.createElement("div");
        contextWrapper.classList.add("day-frame-context-wrapper");

        const contextEl = document.createElement("button");
        contextEl.classList.add("day-frame-context-el");

        const isHighLighted = userData?.importantDates.includes(
          new Date(isoDate).toISOString(),
        );

        contextEl.textContent = isHighLighted
          ? "Remove Highlight"
          : "Highlight";

        contextEl.addEventListener("click", (e) => {
          if (isHighLighted) {
            updateHighLightedEvents(
              {
                importantDates: [
                  ...userData.importantDates.filter(
                    (impDate: string) =>
                      impDate !== new Date(isoDate).toISOString(),
                  ),
                ],
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["ProfileData"] });
                },
              },
            );
          } else {
            updateHighLightedEvents(
              {
                importantDates: [...userData?.importantDates, isoDate],
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["ProfileData"] });
                },
              },
            );
          }
        });

        const background = document.createElement("div");
        background.classList.add("day-frame-context-bg");
        background.addEventListener("click", (e) => {
          dayFrameEl.querySelector(".day-frame-context-bg")?.remove();
          dayFrameEl.querySelector(".day-frame-context-wrapper")?.remove();
        });
        contextWrapper.appendChild(contextEl);

        dayFrameEl.appendChild(contextWrapper);
        dayFrameEl.appendChild(background);
      };

      dayFrameEl.addEventListener("contextmenu", contextMenuListener);
      listenerRefs.push({
        element: dayFrameEl,
        type: "contextmenu",
        listener: contextMenuListener,
      });
    });

    return () => {
      listenerRefs.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
      });
    };
  }, [userData?.importantDates, monthValue]);

  const handleEventDidMount = (info: EventMountArg) => {
    const eventEl = info.el;
    const departments = info?.event?._def?.extendedProps?.departments;
    const titleElement = eventEl?.querySelector(".fc-event-title");
    const isBlockEvent = eventEl?.classList.contains("fc-daygrid-block-event");

    if (departments?.length === 0 || !titleElement || isBlockEvent) return;

    const departmentsWrapper = document.createElement("div");
    departmentsWrapper.classList.add("department-wrapper");

    departments?.map((department: any, i: number) => {
      // console.log("department", department);

      const departmentElement = document.createElement("div");
      departmentElement.classList.add("department-item");
      departmentElement.textContent = department?.code;
      departmentElement.style.fontWeight = "400";

      if (i === 0) {
        departmentElement.style.backgroundColor = "#737373";
        departmentElement.style.border = "0.4px solid #d4d4d4";
      } else {
        departmentElement.style.backgroundColor = "#F5F5F5";
        departmentElement.style.color = "#737373";
        departmentElement.style.border = "0.4px solid #d4d4d4";
      }
      departmentsWrapper.appendChild(departmentElement);
    });
    eventEl?.insertBefore(departmentsWrapper, titleElement);

    return;
    // });
  };

  const handleMouseLeave = (info: EventHoveringArg) => {
    const tooltipEl = info?.el?.querySelector(".event-tooltip");

    if (!tooltipEl) return;
    tooltipEl.remove();
  };

  const handleMouseEnter = (info: EventHoveringArg) => {
    const tooltipWrapper = document.createElement("div");
    tooltipWrapper.innerText = info.event._def.title;
    tooltipWrapper.classList.add("event-tooltip");
    info.el.appendChild(tooltipWrapper);
    tooltipWrapper.classList.add("event-tooltip-transition");
  };

  return (
    <>
      {/* <div className="day-frame-context-wrapper">
        <button className="day-frame-context-el">Highlight</button>
        <button className="day-frame-context-el">Add Event</button>
        <button className="day-frame-context-el">Delete Events</button>
      </div> */}
      <div ref={calWrapper} className="h-full w-full">
        <FullCalendar
          ref={calendarRef}
          plugins={allPlugins}
          initialView={`dayGridMonth`}
          events={events as EventSourceInput}
          eventMouseEnter={handleMouseEnter}
          eventMouseLeave={handleMouseLeave}
          eventDidMount={handleEventDidMount}
          // dateClick={(info) => {
          //   console.log("info", info);
          // }}
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

// useEffect(() => {
//   dayFrameRefs.current = calendarRef.current.elRef.current.querySelectorAll(
//     ".fc-daygrid-day-frame",
//   );
//   const dayFrameEls = Array.from(dayFrameRefs.current);

//   if (!Array.isArray(dayFrameEls)) return;
//   const isHighLight = userData?.importantDates.includes(
//     new Date(isoDate).toISOString(),
//   );
//   dayFrameEls.map((dayFrameEl: HTMLDivElement) => {
//     const topEl = dayFrameEl.querySelector(".fc-daygrid-day-number");
//     const ariaLabelValue = topEl?.getAttribute("aria-label");
//     if (!ariaLabelValue) return;
//     const parsedDate = parse(ariaLabelValue, "MMMM d, yyyy", new Date());
//     const isoDate = format(parsedDate, "yyyy-MM-dd");

//     if (isHighLight) dayFrameEl.style.backgroundColor = "#fffdc3";
//     else {
//       dayFrameEl.style.backgroundColor = "#ffffff";
//     }
//   });
// }, [userData?.importantDates]);
