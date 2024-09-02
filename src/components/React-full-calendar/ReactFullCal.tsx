import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FullCalendar from "@fullcalendar/react";

import {
  DateSelectArg,
  DateUnselectArg,
  EventMountArg,
  EventSourceInput,
} from "@fullcalendar/core";
import { Context } from "@/app/clientWrappers/ContextProvider";
import "./FullCalExtraCss.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "@/services/baseUrl";
import { setCookie } from "@/hooks/CookieHooks";
import {
  useDeleteEvent,
  useUpdateEvents,
} from "@/services/api/eventsApi";
import { parse, format } from "date-fns";
import { delay, generateNewToken } from "@/lib/utils";
import { useGetSemester } from "@/services/api/semester";
import EventDetails from "@/app/(all-pages)/search/EventDetails";
import SemesterView from "./SemesterMonthComponents/SemesterView";
import {
  isMultiDay,
} from "./utils";
import { allPlugins } from "@/constants/CalendarViews";
import { RecurringEventTypes } from "@/constants/RecurringEvents";
import EditEventModal1 from "../AddEventModal/EditEventModal1";

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
  const [selectable, setSelectable] = useState<boolean>(true);

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
  console.log("userData", userData);
  const { mutate: updateEvent } = useUpdateEvents();
  const { mutate: deleteEvent } = useDeleteEvent({});

  const handleSelect = async ({
    start,
    end,
    startStr,
    endStr,
  }: DateSelectArg) => {
    setSelectedDate({ start, end, startStr, endStr });
    clearTimeout(timeout.current);

    // const endDecrement = new Date(end).setDate(new Date(end).getDate() - 1);

    // @ts-ignore
    if (!calendarRef?.current?.elRef?.current || currentView !== "dayGridMonth")
      return;

    setSelectable(false);
    // @ts-ignore
    const allCells = calendarRef.current.elRef.current.querySelectorAll("td");
    const allCellsList = Array.from(allCells);
    const selectedCells: any[] = allCellsList?.filter((cell: any) => {
      const cellDate = new Date(cell.getAttribute("data-date")).getTime();
      return cellDate >= start.getTime() && cellDate < end.getTime();
    });
    console.log("selectedCells", selectedCells);
    const isElsHighlight = selectedCells.every(
      (cell: any) =>
        userData?.importantDates.includes(
          new Date(cell.getAttribute("data-date")).toISOString(),
        ),
    );

    const selectContextEl = document.createElement("div");
    selectContextEl.classList.add("fc-custom-select-context-wrapper");
    const highlightBtnEl = document.createElement("div");
    highlightBtnEl.classList.add("fc-select-item", "fc-select-highlight");
    highlightBtnEl.textContent = isElsHighlight
      ? "Remove Highlight"
      : "Highlight";
    const addEventBtnEl = document.createElement("div");
    addEventBtnEl.classList.add("fc-select-item", "fc-select-add-event");
    addEventBtnEl.innerHTML = `<span class="fc-select-plus">+</span> Add Event`;
    selectContextEl.appendChild(highlightBtnEl);
    selectContextEl.appendChild(addEventBtnEl);
    highlightBtnEl.addEventListener("click", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
      if (isElsHighlight) {
        const selectedDates: string[] = []; //string of dates
        selectedCells.forEach((cell: any) => {
          cell.firstChild.style.backgroundColor = "#FFFFFF";
          const cellDate = new Date(
            cell.getAttribute("data-date"),
          ).toISOString();
          selectedDates.push(cellDate);
        });
        updateHighLightedEvents(
          {
            importantDates: [
              ...userData.importantDates.filter(
                (impDate: string) => !selectedDates.includes(impDate),
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
        const selectedDates: string[] = []; //string of dates
        selectedCells.forEach((cell: any) => {
          cell.firstChild.style.backgroundColor = "#FFFDC3";
          const cellDate = new Date(
            cell.getAttribute("data-date"),
          ).toISOString();
          selectedDates.push(cellDate);
        });
        updateHighLightedEvents(
          {
            importantDates: [...userData?.importantDates, ...selectedDates],
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["ProfileData"] });
            },
          },
        );
      }
    });
    addEventBtnEl.addEventListener("click", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      // if (!addEventModalRef.current) return;
      // @ts-ignore
      // ?.firstChild?.click(),
      const modal_4 = document.getElementById(
        "my_modal_5",
      ) as HTMLDialogElement;
      console.log("modal elemenet", modal_4);
      modal_4.showModal();
      console.log("addEventBtnEl");
    });
    selectedCells[selectedCells.length - 1]?.firstChild?.appendChild(
      selectContextEl,
    );

    return;
  };
  const handleUnselect = (arg: DateUnselectArg) => {
    // @ts-ignore

    timeout.current = setTimeout(function () {
      setSelectedDate({
        start: new Date(),
        end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
        startStr: undefined,
        endStr: undefined,
      });
    }, 250);

    // @ts-ignore
    if (!calendarRef?.current?.elRef?.current || currentView !== "dayGridMonth")
      return;

    const selectContextEl = document.querySelector(
      ".fc-custom-select-context-wrapper",
    );
    if (!selectContextEl) return;
    // @ts-ignore
    selectContextEl.style.opacity = "0";
    setTimeout(() => {
      // @ts-ignore
      selectContextEl?.remove();
      setSelectable(true);
    }, 100);
  };

  useEffect(() => {
    console.log("PROFILE ACTIVE SEMESTER::::", userData?.activeSemester);
    let currnetDate = new Date();
    let semTimeFrame = userData?.activeSemester?.map((semesterId: string) => {
      const semester = semesterData?.find((sem: any) => sem.id == semesterId);
      if (!semester) return;
      return {
        start: new Date(semester?.start && ""),
        end: new Date(semester?.end && ""),
        color: semester.color,
      };
    });

    semTimeFrame = semTimeFrame?.filter((sem: any) => {
      let startDate = new Date(sem?.start ?? "");
      let endDate = new Date(sem?.end ?? "");
      return startDate <= currnetDate && endDate >= currnetDate;
    });

    if (typeof calendarRef === "string") return;
    if (!calendarRef?.current) return;

    // @ts-ignore
    dayFrameRefs.current = calendarRef.current.elRef.current.querySelectorAll(
      ".fc-daygrid-day-frame",
    );
    const dayFrameEls = Array.from(dayFrameRefs.current);

    dayFrameEls.forEach((dayFrameEl: HTMLDivElement) => {
      const dayGridNumber = dayFrameEl.querySelector(".fc-daygrid-day-number");
      const ariaLabelValue = dayGridNumber?.getAttribute("aria-label");

      if (!ariaLabelValue) return;

      const parsedDate = parse(ariaLabelValue, "MMMM d, yyyy", new Date());
      const isoDate = format(parsedDate, "yyyy-MM-dd");

      const isHighLight = userData?.importantDates.includes(
        new Date(isoDate).toISOString(),
      );
      console.log("semTimeFrame", semTimeFrame);

      const isOngoing: boolean = semTimeFrame?.some((sem: any) => {
        if (!sem) return undefined;
        return (
          parsedDate.getTime() >= sem.start.getTime() &&
          parsedDate.getTime() <= sem.end.getTime()
        );
      });
      console.log("isOngoing", isOngoing);

      const today =
        dayFrameEl?.parentElement?.classList.contains("fc-day-today");

      // if parsedDate is  within any of the semesters its ongoing
      // userData?.activeSemester?.forEach((semesterId: string) => {
      //   const semester = semesterData?.find((sem: any) => sem.id == semesterId);
      //   if (!semester) return;
      //   new Date(semester.start).getTime() < startDate.getTime() &&
      //     (startDate = new Date(semester.start));
      //   new Date(semester.end).getTime() > endDate.getTime() &&
      //     (endDate = new Date(semester.end));
      // });
      if (isOngoing) {
        // semTimeFrame.length === 1
        //   ? (dayFrameEl.style.backgroundColor = semTimeFrame[0].color + "19")
        dayFrameEl.style.backgroundColor = "rgba(227, 242, 218, 0.4)";
      } else {
        dayFrameEl.style.backgroundColor = "#ffffff";
      }
      if (isHighLight) dayFrameEl.style.backgroundColor = "#FFFDC3";
      else if (today) {
        dayFrameEl.style.backgroundColor = "#5D9936";
        dayFrameEl.style.color = "#ffffff";
      }
      // else dayFrameEl.style.backgroundColor = "#ffffff";
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthValue, userData]);

  const handleEventDidMount = async (info: EventMountArg) => {
    const departments = info?.event?._def?.extendedProps?.departments;
    const start = info.event._instance?.range?.start;
    const end = info.event._instance?.range?.end;

    const startTime = start ? format(start, "h:mm a") : "00: 00 am";
    const endTime = end ? format(end, "h:mm a") : "00: 00 am";
    const eventEl = info.el;

    if (currentView === "timeGridWeek" || currentView === "timeGridDay") {
      // console.log("Week event", info);

      const timeEl = document.createElement("div");

      timeEl.innerText = `${startTime} - ${endTime}`;
      timeEl.style.color = "#737373";
      timeEl.style.fontWeight = "400";

      const mainFrameEl = info.el.querySelector(".fc-event-main-frame");
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

      const titleContainer =
        mainFrameEl && mainFrameEl.querySelector(".fc-event-title-container");
      titleContainer &&
        mainFrameEl?.insertBefore(departmentsWrapper, titleContainer);
      mainFrameEl?.appendChild(timeEl);

      const mainEventEl = info.el.querySelector(
        ".fc-event-main",
      ) as HTMLElement;

      info.el.style.borderLeft = `3px solid ${info.backgroundColor}`;
      info.el.style.borderLeft = `3px solid ${info.backgroundColor}`;
      info.el.style.borderLeft = `5px solid ${info.backgroundColor}`;
      info.el.style.backgroundColor = `${info.backgroundColor}26`;
    } else if (currentView === "dayGridMonth") {
      const titleElement = eventEl?.querySelector(".fc-event-title");

      if (departments?.length === 0 || !titleElement) return;

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

      //for multidate
      if (start && end && isMultiDay(start.getTime(), end.getTime())) {
        const isFirstBlock = eventEl.classList.contains("fc-event-start");
        eventEl.style.backgroundColor = `${info.backgroundColor}32`;
        eventEl.style.color = "black";
        if (isFirstBlock) {
          eventEl.style.borderLeft = ` 4px solid ${info.borderColor}`;
          // @ts-ignore
          eventEl.parentElement.style.paddingLeft = "8px";
          eventEl?.insertBefore(departmentsWrapper, eventEl.firstChild);
        } else {
          // @ts-ignore
          // eventEl.parentElement.style.paddingLeft = "8px";
          eventEl?.insertBefore(departmentsWrapper, eventEl.firstChild);
        }
        return;
      }
      eventEl?.insertBefore(departmentsWrapper, eventEl.firstChild);

      return;
    }
  };

  // const setHeightOfDayFrame = (node: HTMLDivElement) => {
  //   const dateNumberHeight = // @ts-ignore
  //     node.querySelector(".fc-daygrid-day-top")?.offsetHeight;
  //   const eventsTotalHeight = // @ts-ignore
  //     node.querySelector(".fc-daygrid-day-events")?.offsetHeight;

  //   node.style.minHeight = `${dateNumberHeight + eventsTotalHeight}px`;
  // };

  const handleDelete = (e: any) => {
    const { value } = e.target;
    deleteEvent({ id: value });
  };

  // useApplyYearlySemesterView({
  //   // @ts-ignore
  //   multiMonthEls: calendarRef?.current?.elRef?.current?.querySelectorAll(
  //     ".fc-multimonth-month",
  //   ),
  //   currentView: currentView,
  // });

  // useEffect(() => {
  //   if (!calendarApi) return;
  //   console.log("currview", currentView);
  //   calendarApi.changeView(currentView);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentView, calendarRef]);

  useEffect(() => {
    if (events && selectedEvent) {
      let newlyFetchedSelectedEvent = events.find(
        (event: eventType) => event._id === selectedEvent._id,
      );
      if (newlyFetchedSelectedEvent) {
        setSelectedEvent(newlyFetchedSelectedEvent);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

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
                ...info?.event?._def?.extendedProps,
                start: info?.event?.start,
                end: info?.event?.end,
                title: info?.event?._def?.title,
                color:
                  info?.event?._def?.ui?.backgroundColor ||
                  info?.event?._def?.ui?.borderColor,
              };
              // console.log("selectedEventObj", info.event.start, info.event.end);

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
            selectable={selectable}
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
            eventMaxStack={3}
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
      <EditEventModal1
        // type="Add"
        defaultData={{
          start: selectedDate?.start
            ? new Date(selectedDate?.start)
            : new Date(),
          end: selectedDate?.end
            ? new Date(selectedDate?.end.getTime() - 1000 * 60 * 60 * 24)
            : new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
          departments: [],
          title: "",
          recurringType: RecurringEventTypes.ONCE,
          involvedUsers: [],
          recurrenceEnd: null,
        }}
      ></EditEventModal1>
    </>
  );
}

// eventDragStart={(e) => {
// }}

// dateClick={(dateClickInfo) => {
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

// const handleMouseLeave = (info: EventHoveringArg) => {
//   const tooltipEl = info?.el?.querySelector(".event-tooltip");

//   if (!tooltipEl) return;
//   tooltipEl.remove();
// };

// const handleMouseEnter = (info: EventHoveringArg) => {
//   const tooltipWrapper = document.createElement("div");
//   tooltipWrapper.innerText = info.event._def.title;
//   tooltipWrapper.classList.add("event-tooltip");
//   info.el.appendChild(tooltipWrapper);
//   tooltipWrapper.classList.add("event-tooltip-transition");
// };
