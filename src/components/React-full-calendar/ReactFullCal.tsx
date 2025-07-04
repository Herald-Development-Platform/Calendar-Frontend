import React, { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";

import {
  CalendarApi,
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
import { useDeleteEvent, useUpdateEvents } from "@/services/api/eventsApi";
import { parse, format } from "date-fns";
import { delay, generateNewToken } from "@/lib/utils";
import { useGetSemester } from "@/services/api/semester";
import EventDetails from "@/app/(all-pages)/search/EventDetails";
import SemesterView from "./SemesterMonthComponents/SemesterView";
import { isMultiDay, useApplyHighlightOrOngoing } from "./utils";
import { allPlugins } from "@/constants/CalendarViews";
import { RecurringEventTypes } from "@/constants/RecurringEvents";
import EditEventModal1 from "../AddEventModal/EditEventModal1";
import toast from "react-hot-toast";
import EventDialog, { EventDialogRef } from "../AddEventModal/EventDialog";
import { totalDaysInMonth } from "./lastDay";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { useGetAllTasks } from "@/services/api/taskManagement/taskApi";
import { TaskDialog } from "@/components/taskmanagement/task/task-dialog";
import { ITask } from "@/types/taskmanagement/task.types";

export default function ReactFullCal() {
  const {
    calendarRef,
    currentView,
    setCurrentView,
    setSelectedDate,
    selectedDate,
    timeout,
    events,
    setOpenDialog,
    setSelectedEventData,
  } = useContext(Context);

  const { data: tasksData } = useGetAllTasks();
  console.log(tasksData?.data)

  const calWrapper = useRef<HTMLDivElement>(null);
  const dayFrameRefs = useRef<HTMLDivElement[]>([]);

  const monthValue =
    selectedDate?.start && new Date(selectedDate?.start).getMonth();
  const [selectedEvent, setSelectedEvent] = useState<eventType | null>(null);
  const [eventDetailWidth, setEventDetailWidth] = useState<number | null>(null);
  const [selectable, setSelectable] = useState<boolean>(true);
  const [calendarApi, setCalendarApi] = useState<CalendarApi>();

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
  const modalRef = useRef<EventDialogRef | null>(null);

  // State for TaskDialog
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  // Prepare tasks as calendar items
  const now = new Date();
  const soonThreshold = 1000 * 60 * 60 * 24 * 2; // 2 days in ms
  const taskEvents = (tasksData?.data || [])
    .filter((task: ITask) => !!task.dueDate)
    .map((task: ITask) => {
      const dueDate = new Date(task.dueDate!);
      const isCompleted = !!task.isCompleted;
      const isDueSoon = !isCompleted && dueDate.getTime() - now.getTime() <= soonThreshold && dueDate.getTime() - now.getTime() > 0;
      return {
        id: task._id,
        title: task.title,
        start: dueDate,
        end: dueDate,
        type: "task",
        originalTask: task,
        color: isCompleted ? "#43A047" : isDueSoon ? "#FFA726" : "#2D9CDB",
        display: "block",
        isCompleted,
        isDueSoon,
      };
    });

  // Merge events and tasks for the calendar
  const mergedEvents = [
    ...(events || []),
    ...taskEvents,
  ];

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
    const lastSelCell = selectedCells[selectedCells.length - 1];
    const isElsHighlight = selectedCells.every((cell: any) =>
      userData?.importantDates.includes(
        new Date(cell.getAttribute("data-date")).toISOString(),
      ),
    );

    const selectContextEl = document.createElement("div");
    selectContextEl.classList.add("fc-custom-select-context-wrapper");
    if (
      lastSelCell.parentElement.lastChild === lastSelCell &&
      lastSelCell.parentElement.parentElement.lastChild ===
        lastSelCell.parentElement
    ) {
      selectContextEl.style.bottom = "80%";
      selectContextEl.style.right = "100%";
    } else if (lastSelCell.parentElement.lastChild === lastSelCell) {
      selectContextEl.style.top = "80%";
      selectContextEl.style.right = "100%";
    } else if (
      lastSelCell.parentElement.parentElement.lastChild ===
      lastSelCell.parentElement
    ) {
      selectContextEl.style.bottom = "80%";
      selectContextEl.style.left = "100%";
    } else {
      selectContextEl.style.top = "80%";
      selectContextEl.style.left = "100%";
    }
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
      //@ts-ignore
      // addEventModalRef?.firstChild?.click(),
      // const modal_4 = document.getElementById(
      //   "my_modal_5",
      // ) as HTMLDialogElement;
      // modal_4.showModal();
      setSelectedEventData(null);
      setOpenDialog(true);

      // toast.success("heelo")

      // if (modalRef.current) {
      //   toast.success("hi")
      //   modalRef.current.openDialog(); // Open the dialog
      // }
      // toast.error("error")
    });
    lastSelCell?.firstChild?.appendChild(selectContextEl);

    return;
  };
  const handleUnselect = (arg: DateUnselectArg) => {
    const date = new Date();
    const currentDay = date.getDate();
    const lastDay = totalDaysInMonth(date.getMonth() + 1, date.getFullYear());
    // @ts-ignore

    timeout.current = setTimeout(function () {
      setSelectedDate({
        start: new Date(),
        end: new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * (lastDay - currentDay),
        ),
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

  // useApplyHighlightOrOngoing({
  //   monthValue,
  //   userData,
  //   semesterData,
  //   calendarRef,
  //   dayFrameRefs,
  // });

  useEffect(() => {
    let currnetDate = new Date();
    let semTimeFrame = userData?.activeSemester?.map((semesterId: string) => {
      const semester = semesterData?.find((sem: any) => sem.id == semesterId);
      if (!semester) return;
      return {
        start: new Date(semester?.start ?? ""),
        end: new Date(semester?.end ?? ""),
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

      const isOngoing: boolean = semTimeFrame?.some((sem: any) => {
        if (!sem) return undefined;
        return (
          parsedDate.getTime() >= sem?.start?.getTime() &&
          parsedDate.getTime() <= sem?.end?.getTime()
        );
      });

      const today =
        dayFrameEl?.parentElement?.classList.contains("fc-day-today");

      if (isOngoing) {
        dayFrameEl.style.backgroundColor = "rgba(227, 242, 218, 0.4)";
      } else {
        dayFrameEl.style.backgroundColor = "#ffffff";
      }
      if (isHighLight) dayFrameEl.style.backgroundColor = "#FFFDC3";
      else if (today) {
        dayFrameEl.style.backgroundColor = "#5D9936";
        dayFrameEl.style.color = "#ffffff";
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthValue, userData]);

  const handleEventDidMount = async (info: EventMountArg) => {
    const departments = info?.event?._def?.extendedProps?.departments;
    const start = info.event._instance?.range?.start;
    const end = info.event._instance?.range?.end;

    const role = info.event._def?.extendedProps?.createdBy.role;

    const displayStart = start?.toISOString() ?? new Date().toISOString();
    const displayEnd = end?.toISOString() ?? new Date().toISOString();

    const startTime = displayStart
      .split("T")[1]
      .split(":")
      .slice(0, 2)
      .join(":");
    const endTime = displayEnd.split("T")[1].split(":").slice(0, 2).join(":");

    const eventEl = info.el;

    if (currentView === "timeGridWeek" || currentView === "timeGridDay") {
      const duration = start && end ? end?.getTime() - start?.getTime() : 0;
      const twoHours = 1000 * 60 * 60 * 2;
      const hours = Math.floor(duration / (1000 * 60 * 60));

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
        departmentElement.classList.add("truncate");
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

      if (duration > twoHours) {
        mainFrameEl?.appendChild(timeEl);
      }

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
      // departments?.map((department: any, i: number) => {
      //   const departmentElement = document.createElement("div");
      //   departmentElement.classList.add("department-item");
      //   departmentElement.textContent = department?.code;
      //   departmentElement.style.fontWeight = "400";

      //   if (i === 0 && role !== "SUPER_ADMIN") {
      //     departmentElement.style.backgroundColor = "#737373";
      //     departmentElement.style.border = "0.4px solid #d4d4d4";
      //   } else {
      //     departmentElement.style.backgroundColor = "#F5F5F5";
      //     departmentElement.style.color = "#737373";
      //     departmentElement.style.border = "0.4px solid #d4d4d4";
      //   }

      //   departmentsWrapper.appendChild(departmentElement);
      // });

      const departmentsElement = document.createElement("div");
      departmentsElement.classList.add("department-item");
      departmentsElement.textContent = departments[0]?.code;
      departmentsElement.style.fontWeight = "400";

      if (role !== "SUPER_ADMIN") {
        departmentsElement.style.backgroundColor = "#737373";
        departmentsElement.style.border = "0.4px solid #d4d4d4";
      } else {
        departmentsElement.style.backgroundColor = "#F5F5F5";
        departmentsElement.style.color = "#737373";
        departmentsElement.style.border = "0.4px solid #d4d4d4";
      }

      departmentsWrapper.appendChild(departmentsElement);

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
    deleteEvent(
      { id: value },
      {
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      },
    );
  };

  // useApplyYearlySemesterView({
  //   // @ts-ignore
  //   multiMonthEls: calendarRef?.current?.elRef?.current?.querySelectorAll(
  //     ".fc-multimonth-month",
  //   ),
  //   currentView: currentView,
  // });

  useEffect(() => {
    // @ts-ignore
    const calApi = calendarRef?.current?.getApi();
    setCalendarApi(calApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRef]);

  useEffect(() => {
    if (!calendarApi?.changeView) return;
    calendarApi.changeView(currentView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, calendarRef]);

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
              // If it's a task, open TaskDialog
              if (info.event.extendedProps.type === "task") {
                setSelectedTask(info.event.extendedProps.originalTask);
                setOpenTaskDialog(true);
                return;
              }
              // Otherwise, keep event behavior
              const selectedEventObj = {
                ...info?.event?._def?.extendedProps,
                start: info?.event?.start,
                end: info?.event?.end,
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
            events={mergedEvents as EventSourceInput}
            eventDidMount={(info) => {
              // Add a custom class for tasks
              if (info.event.extendedProps.type === "task") {
                info.el.classList.add("fc-task-event");
                if (info.event.extendedProps.isCompleted) {
                  info.el.classList.add("fc-task-completed");
                } else if (info.event.extendedProps.isDueSoon) {
                  info.el.classList.add("fc-task-due-soon");
                }
                // Optionally, add an icon or change innerHTML for tasks
                const titleEl = info.el.querySelector(".fc-event-title");
                if (titleEl) {
                  let icon = "📝";
                  if (info.event.extendedProps.isCompleted) icon = "✅";
                  else if (info.event.extendedProps.isDueSoon) icon = "⏰";
                  // titleEl.innerHTML = `<span style='font-weight:bold;margin-right:4px;'>${icon}</span>` + titleEl.innerHTML;
                }
              } else {
                handleEventDidMount(info);
              }
            }}
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
            {mergedEvents && selectedDate?.start ? (
              <SemesterView
                events={mergedEvents}
                year={new Date(selectedDate.start).getFullYear()}
              ></SemesterView>
            ) : (
              <p>
                Error: <br /> events: {Boolean(mergedEvents).toString()} <br />{" "}
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
      {/* Task Dialog for tasks */}
      {selectedTask && (
        <TaskDialog
          openTaskDialog={openTaskDialog}
          setOpenTaskDialog={setOpenTaskDialog}
          task={selectedTask}
        />
      )}
      {/* <EditEventModal1
      // ref={modalRef}
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
      ></EditEventModal1> */}
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
// eventMouseEnter={handleMouseEnter}
// eventMouseLeave={handleMouseLeave}
