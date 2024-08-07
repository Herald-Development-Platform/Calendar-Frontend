"use client";
import React, { useContext, useEffect, useId, useRef, useState } from "react";
import "./styles.css";
import { format, lastDayOfMonth } from "date-fns";
import { BsDot } from "react-icons/bs";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { allPlugins, CalendarViews } from "@/constants/CalendarViews";
import FullCalendar from "@fullcalendar/react";
import {
  CalendarApi,
  DateInput,
  EventMountArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import { useGetCalendarApi } from "../utils";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

export default function SemesterMonth({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  events,
}: {
  year: number;
  month: number;
  events: eventType[];
}) {
  const [isDoubleClick, setIsDoubleClick] = useState<number>(-1);
  const [openWeekView, setOpenWeekView] = useState<boolean>(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<FullCalendar>(null);

  // const [calendarApi, setCalendarApi] = useState<CalendarApi>();
  // useEffect(() => {
  //   console.log("getApi", calRef.current?.getApi());
  //   console.log("calREf", calRef.current);

  //   setCalendarApi(calRef.current?.getApi());
  //   console.log("calendarApi", calendarApi);
  // }, [calRef]);

  const { setSelectedDate, selectedDate } = useContext(Context);

  const firstDaysOfWeeks = getFirstDaysOfWeeks({ year: year, month: month });
  const lastMonthDate = getLastDayOfMonth({ year: year, month: month });
  const finalSectionLength =
    lastMonthDate -
    new Date(firstDaysOfWeeks[firstDaysOfWeeks.length - 1]).getDate() +
    1;

  useEffect(() => {
    console.log("render", openWeekView);
    if (!calRef.current) return;
    // @ts-ignore
    // console.log("calRef", calRef.current.elRef.current.children[0]);
    // @ts-ignore
    const TableEl = calRef.current.elRef.current.children[0];
    TableEl.style.height = `590px`;
  }, [calRef, isDoubleClick, openWeekView]);

  // console.log("toay", calRef);

  const handleEventDidMount = async (info: EventMountArg) => {
    const departments = info?.event?._def?.extendedProps?.departments;
    const startTime = info.event._instance?.range?.start
      ? format(info.event._instance?.range.start, "h:mm a")
      : "00: 00 am";
    const endTime = info.event._instance?.range?.end
      ? format(info.event._instance?.range.end, "h:mm a")
      : "00: 00 am";

    console.log("info", info);
    // if (currentView === "timeGridWeek" || currentView === "timeGridDay") {
    console.log("Week event", info);

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

    const mainEventEl = info.el.querySelector(".fc-event-main") as HTMLElement;

    info.el.style.borderLeft = `3px solid ${info.backgroundColor}`;
    info.el.style.borderLeft = `3px solid ${info.backgroundColor}`;
    info.el.style.borderLeft = `5px solid ${info.backgroundColor}`;
    info.el.style.backgroundColor = `${info.backgroundColor}26`;
  };
  return (
    <>
      <div className="flex flex-col items-center gap-[9px]">
        <h3 className="text-[18px] font-bold leading-[20px]">
          {format(new Date(year, month - 1), "MMMM")}
        </h3>
        <div ref={gridRef} className="sem-grid">
          <>
            <div className="leading[20px] flex  h-[22px] w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Sun
            </div>
            <div className="leading[20px] flex h-[22px]  w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Mon
            </div>
            <div className="leading[20px] flex  h-[22px] w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Tue
            </div>
            <div className="leading[20px] flex h-[22px]  w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Wed
            </div>
            <div className="h-[22px ] leading[20px] flex w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Thu
            </div>
            <div className="h-[22px ] leading[20px] flex w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Fri
            </div>
            <div className="h-[22px ] leading[20px] flex w-full items-center justify-center border-[0.5px] border-[#dddddd] text-[13px] font-semibold  text-neutral-700">
              Sat
            </div>
          </>
          <>
            {firstDaysOfWeeks.map((checkpointDays, i) => {
              const date = new Date(checkpointDays);
              const day = date.getDay();
              const gridSpanValue =
                i !== firstDaysOfWeeks.length - 1
                  ? 7 - day
                  : finalSectionLength;

              // cosnt;
              let totalEvents = 0;

              events?.filter((event) => {
                let inFirstEdge = null;
                let inBetween = null;
                let inLastEdge = null;

                const eventStart = event?.start
                  ? new Date(event.start).getTime()
                  : 0;

                const eventEnd = event?.end ? new Date(event.end).getTime() : 0;

                const selectedStartTime = firstDaysOfWeeks[i]
                  ? new Date(firstDaysOfWeeks[i])?.getTime()
                  : 0;

                const selectedEndTime =
                  i === firstDaysOfWeeks.length - 1
                    ? new Date(year, month, 0).getTime()
                    : firstDaysOfWeeks[i + 1]
                    ? new Date(firstDaysOfWeeks[i + 1]).getTime()
                    : 0;

                inFirstEdge =
                  eventStart <= selectedStartTime &&
                  eventEnd > selectedStartTime;
                inBetween =
                  eventStart > selectedStartTime && eventEnd < selectedEndTime;
                inLastEdge =
                  eventStart < selectedEndTime && eventEnd >= selectedEndTime;

                if (!inFirstEdge && !inBetween && !inLastEdge) return;
                totalEvents++;
              });

              return (
                <>
                  {i === 0 &&
                    day !== 0 &&
                    [...Array(day)].map((_) => {
                      return (
                        <>
                          <div className="border-[0.5px] border-[#DDDDDD] bg-[#F1F1F1]"></div>
                        </>
                      );
                    })}

                  <div
                    className="flex flex-nowrap items-center overflow-hidden truncate border-[0.5px] border-[#DDDDDD] bg-[#ffffff] pl-5 text-xl text-neutral-600 focus:border-primary-600"
                    style={{ gridColumn: `span ${gridSpanValue}` }}
                    tabIndex={0}
                    onClick={(e: any) => {
                      const start = new Date(firstDaysOfWeeks[i]);
                      // console.log("isDoubleClick", i, isDoubleClick.current);
                      if (isDoubleClick === i) {
                        setOpenWeekView(true);
                        // calendarApi?.gotoDate(
                        //   new Date(firstDaysOfWeeks[i]).getTime(),
                        // );
                      }

                      setIsDoubleClick(i);
                      setTimeout(() => {
                        setIsDoubleClick(-1);
                      }, 600);

                      const end =
                        i !== firstDaysOfWeeks.length - 1
                          ? new Date(firstDaysOfWeeks[i + 1])
                          : new Date(year, month, 0);
                      setSelectedDate({
                        start: start,
                        end: end,
                        startStr: format(start, "yyyy-MM-dd"),
                        endStr: format(end, "yyyy-MM-dd"),
                      });
                    }}
                    id={`${i}`}
                  >
                    <span className="text-sm font-medium ">
                      {totalEvents} {gridSpanValue > 1 ? "Events" : "E..."}
                    </span>
                    {gridSpanValue > 2 && (
                      <>
                        <BsDot />
                        <span className="flex text-sm text-neutral-400">
                          {new Date(checkpointDays).getDate()}th -
                          {new Date(checkpointDays).getDate() +
                            gridSpanValue -
                            1}
                          th
                        </span>
                      </>
                    )}
                  </div>

                  {i === firstDaysOfWeeks.length - 1 &&
                    finalSectionLength !== 7 &&
                    [...Array(7 - finalSectionLength)].map((_, i) => {
                      return (
                        <>
                          <div className="border-[0.5px] border-[#DDDDDD] bg-[#F1F1F1]"></div>
                        </>
                      );
                    })}
                </>
              );
            })}
          </>
        </div>
      </div>
      <Dialog open={openWeekView} onOpenChange={setOpenWeekView}>
        <DialogContent className="green-scrollbar h-[1000px] max-h-[85%] max-w-[85%] overflow-hidden overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="">Weekly View</DialogTitle>
          </DialogHeader>
          <div>
            <FullCalendar
              ref={calRef}
              plugins={allPlugins}
              // datesSet={(info) => {
              //   if (currentView === info.view.type) return;
              //   setCurrentView(info.view.type);
              // }}
              // eventClick={(info) => {
              //   const selectedEventObj = {
              //     ...info?.event?._instance?.range,
              //     ...info?.event?._def?.extendedProps,
              //     title: info?.event?._def?.title,
              //     color:
              //       info?.event?._def?.ui?.backgroundColor ||
              //       info?.event?._def?.ui?.borderColor,
              //   };
              //   const upcommingEventWidth =
              //     // @ts-ignore
              //     document.querySelector("#upcomming-events")?.offsetWidth;
              //   setEventDetailWidth(upcommingEventWidth);
              //   setSelectedEvent(selectedEventObj as eventType);
              // }}
              initialView={CalendarViews.timeGrid.week}
              events={events as EventSourceInput}
              // eventMouseEnter={handleMouseEnter}
              // eventMouseLeave={handleMouseLeave}
              eventDidMount={handleEventDidMount}
              headerToolbar={false}
              selectable={true}
              initialDate={selectedDate?.start}
              // select={handleSelect}
              viewDidMount={async (info: any) => {
                console.log("viewdidmount", info);
                // await delay(200);
                // if (
                //   calendarRef?.current?.getApi()?.view?.type !== "dayGridMonth"
                // )
                //   return;
                // const scrollerEl = info.el.querySelector(
                //   ".fc-scroller-liquid-absolute",
                // );
                // if (!scrollerEl) return;
                // scrollerEl.style.overflow = "visible";
                // console.log("viewdidmount ------------------", scrollerEl);
              }}
              // windowResize={async (arg) => {
              //   await delay(200);
              //   const scrollerEl = // @ts-ignore
              //     calendarRef?.current?.elRef?.current.querySelector(
              //       ".fc-scroller-liquid-absolute",
              //     );
              //   scrollerEl.style.overflow = "visible";
              // }}
              // unselect={handleUnselect}
              displayEventTime={false}
              // dayHeaderClassNames={"customStylesDayHeader"}
              // dayCellClassNames={"customStylesDayCells"}
              // eventMaxStack={2}
              // dayMaxEvents={2}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getFirstDayOfMonth(year: number, month: number) {
  // Create a new Date object for the first day of the given month
  const date = new Date(year, month - 1, 1); // month is 0-based
  return date.getDay(); // getDay() returns the day of the week (0-6)
}
function getLastDayOfMonth({ year, month }: { year: number; month: number }) {
  let date = new Date(year, month, 0);
  return date.getDate();
}

function getFirstDaysOfWeeks({ year, month }: { year: number; month: number }) {
  const firstDayOfWeek = [];

  let date = new Date(year, month - 1, 1);
  // console.log("--------------date-ddddddddddddd", date, year, month);
  firstDayOfWeek.push(date.toISOString());
  // console.log("date.getDay()", date.getDay());

  const daysTillUpcommingSunday = 7 - date.getDay();
  date.setDate(date.getDate() + daysTillUpcommingSunday);
  // console.log("after set date", date);
  while (true) {
    firstDayOfWeek.push(date.toISOString());
    date.setDate(date.getDate() + 7);
    if (date.getMonth() !== month - 1) break;
  }
  return firstDayOfWeek;
}
