import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import Calendar, {
  DateSelectArg,
  DateUnselectArg,
  DayCellMountArg,
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
import {
  useDeleteEvent,
  useGetEvents,
  useUpdateEvents,
} from "@/services/api/eventsApi";
import { CalendarApi } from "@fullcalendar/core/index.js";

import { parse, format } from "date-fns";
import { delay, generateNewToken } from "@/lib/utils";
import { useGetSemester } from "@/services/api/semester";
import EventDetails from "@/app/(all-pages)/search/EventDetails";
import SemesterView from "./SemesterMonthComponents/SemesterView";
import {
  useApplySemesterDot,
  useApplySemesterDotYearly,
  useApplyYearlySemesterView,
} from "./utils";

const allPlugins = [
  dayGridPlugin,
  multiMonthPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
  multiMonthPlugin,
];

export default function ReactFullCal({} // eventDetailWidth,
: {
  // eventDetailWidth: number | null;
}) {
  const {
    calendarRef,
    currentView,
    setCurrentView,
    setSelectedDate,
    selectedDate,
    timeout,
    events,
  } = useContext(Context);

  const calWrapper = useRef<HTMLDivElement>(null);
  const dayFrameRefs = useRef<HTMLDivElement[]>([]);

  const monthValue =
    selectedDate?.start && new Date(selectedDate?.start).getMonth();
  const [selectedEvent, setSelectedEvent] = useState<eventType | null>(null);
  const [eventDetailWidth, setEventDetailWidth] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { mutate: updateHighLightedEvents } = useMutation({
    mutationFn: (payload: any) => Axios.patch("/profile", payload),
  });

  const { data: userData } = useQuery({
    queryKey: ["ProfileData"],
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

  const { data: semesterData } = useGetSemester();
  const { mutate: updateEvent } = useUpdateEvents();
  const { mutate: deleteEvent } = useDeleteEvent({});

  const handleSelect = ({ start, end, startStr, endStr }: DateSelectArg) => {
    setSelectedDate({ start, end, startStr, endStr });
    clearTimeout(timeout.current);
  };

  const handleUnselect = (arg: DateUnselectArg) => {
    timeout.current = setTimeout(function () {
      setSelectedDate({
        start: new Date(),
        end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
        startStr: undefined,
        endStr: undefined,
      });
    }, 250);
  };

  useEffect(() => {
    if (typeof calendarRef === "string") return;
    if (!calendarRef?.current) return;

    // @ts-ignore
    dayFrameRefs.current = calendarRef.current.elRef.current.querySelectorAll(
      ".fc-daygrid-day-frame",
    );
    const dayFrameEls = Array.from(dayFrameRefs.current);

    const listenerRefs: any[] = [];

    if (!Array.isArray(dayFrameEls)) return;

    dayFrameEls.forEach((dayFrameEl: HTMLDivElement) => {
      const dayGridNumber = dayFrameEl.querySelector(".fc-daygrid-day-number");
      const ariaLabelValue = dayGridNumber?.getAttribute("aria-label");

      // addSemesterView(dayFrameEl, semesterData);
      if (!ariaLabelValue) return;

      const parsedDate = parse(ariaLabelValue, "MMMM d, yyyy", new Date());
      const isoDate = format(parsedDate, "yyyy-MM-dd");

      const isHighLight = userData?.importantDates.includes(
        new Date(isoDate).toISOString(),
      );

      if (isHighLight) dayFrameEl.style.backgroundColor = "#fffdc3";
      else dayFrameEl.style.backgroundColor = "#ffffff";

      // setHeightOfDayFrame(dayFrameEl);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.importantDates, monthValue]);

  const handleEventDidMount = async (info: EventMountArg) => {
    await delay(1000);
    console.log("--- handleEventDidMount ", currentView);
    if (currentView !== "dayGridMonth") return;

    // console.log("handleEventDidMount -----");
    const eventEl = info.el;
    const departments = info?.event?._def?.extendedProps?.departments;
    const titleElement = eventEl?.querySelector(".fc-event-title");
    const isBlockEvent = eventEl?.classList.contains("fc-daygrid-block-event");

    if (departments?.length === 0 || !titleElement || isBlockEvent) return;

    const departmentsWrapper = document.createElement("div");
    departmentsWrapper.classList.add("department-wrapper");

    departments?.map((department: any, i: number) => {
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

    // eventEl?.insertBefore(departmentsWrapper, titleElement);

    return;
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

  const setHeightOfDayFrame = (node: HTMLDivElement) => {
    const dateNumberHeight = // @ts-ignore
      node.querySelector(".fc-daygrid-day-top")?.offsetHeight;
    const eventsTotalHeight = // @ts-ignore
      node.querySelector(".fc-daygrid-day-events")?.offsetHeight;

    node.style.minHeight = `${dateNumberHeight + eventsTotalHeight}px`;
  };

  const handleDelete = (e: any) => {
    const { value } = e.target;
    deleteEvent({ id: value });
  };

  // useApplySemesterDotYearly({
  //   calendarRef,
  //   semesterData,
  //   monthValue,
  //   currentView,
  // });

  // useApplySemesterDot({
  //   calendarRef,
  //   semesterData,
  //   monthValue,
  //   currentView,
  // });

  useApplyYearlySemesterView({
    // @ts-ignore
    multiMonthEls: calendarRef?.current?.elRef?.current?.querySelectorAll(
      ".fc-multimonth-month",
    ),
    currentView: currentView,
  });

  useEffect(() => {
    if (!calendarRef?.current) return;
    console.log("calendarRef.current?.getApi()", calendarRef.current?.getApi());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, calendarRef]);

  return (
    <>
      <div ref={calWrapper} className="relative h-full w-auto">
        <>
          <FullCalendar
            ref={calendarRef}
            plugins={allPlugins}
            datesSet={(info) => {
              if (currentView === info.view.type) return;
              setCurrentView(info.view.type);
            }}
            eventClick={(info) => {
              const selectedEventObj = {
                ...info?.event?._instance?.range,
                ...info?.event?._def?.extendedProps,
                title: info?.event?._def?.title,
                color:
                  info?.event?._def?.ui?.backgroundColor ||
                  info?.event?._def?.ui?.borderColor,
              };
              const upcommingEventWidth =
                // @ts-ignore
                document.querySelector("#upcomming-events")?.offsetWidth;
              setEventDetailWidth(upcommingEventWidth);
              setSelectedEvent(selectedEventObj as eventType);
            }}
            initialView={`dayGridMonth`}
            events={events as EventSourceInput}
            // eventMouseEnter={handleMouseEnter}
            // eventMouseLeave={handleMouseLeave}
            eventDidMount={handleEventDidMount}
            headerToolbar={false}
            selectable={true}
            select={handleSelect}
            viewDidMount={async (info: any) => {
              await delay(200);
              if (calendarRef?.current?.getApi()?.view?.type !== "dayGridMonth")
                return;
              const scrollerEl = info.el.querySelector(
                ".fc-scroller-liquid-absolute",
              );
              if (!scrollerEl) return;
              scrollerEl.style.overflow = "visible";
              console.log("viewdidmount ------------------", scrollerEl);
            }}
            windowResize={async (arg) => {
              await delay(200);
              const scrollerEl = // @ts-ignore
                calendarRef?.current?.elRef?.current.querySelector(
                  ".fc-scroller-liquid-absolute",
                );
              scrollerEl.style.overflow = "visible";
            }}
            unselect={handleUnselect}
            displayEventTime={false}
            dayHeaderClassNames={"customStylesDayHeader"}
            dayCellClassNames={"customStylesDayCells"}
            eventMaxStack={2}
            dayMaxEvents={2}
          />
        </>

        {currentView === "multiMonthYear" && (
          <div className="absolute left-0 top-0 z-10 h-full w-full bg-white">
            {events && selectedDate?.start ? (
              <SemesterView
                events={events}
                year={new Date(selectedDate.start).getFullYear()}
              ></SemesterView>
            ) : (
              <p>
                Error: <br /> events: {Boolean(events).toString()} <br />{" "}
                selDate:
                {Boolean(selectedDate?.start).toString()}
              </p>
            )}
          </div>
        )}
      </div>
      <EventDetails
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        updateEvent={updateEvent}
        handleDelete={handleDelete}
        width={eventDetailWidth || null}
      ></EventDetails>
    </>
  );
}

function applySemesterBox({ trEl }: { trEl: HTMLTableRowElement }) {
  // remove borders in table cell
  // add another layer above cells
  //make new calendar comopnent
  // /\/\/\ remove existing cells and replace it with a new div.
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
//   dayFrameEls = calendarRef.current.elRef.current.querySelectorAll(
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
// dayCellDidMount={handleDayCellMount}
// dateClick={(info) => {
//   console.log("info", info);
// }}
