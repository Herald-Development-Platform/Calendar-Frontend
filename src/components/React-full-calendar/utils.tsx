import { CalendarApi } from "@fullcalendar/core/index.js";
import { RefObject } from "@fullcalendar/core/preact.js";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";

const useApplySemesterDot = ({
  calendarRef,
  semesterData,
  monthValue,
  currentView,
}: {
  calendarRef: RefObject<FullCalendar> | undefined;
  semesterData: SemesterType[] | undefined;
  monthValue: number | undefined;
  currentView?: string;
}) => {
  return useEffect(() => {
    if (!calendarRef?.current || currentView !== "dayGridMonth") return;

    // @ts-ignore
    const dayFrameElements = calendarRef.current.elRef.current.querySelectorAll(
      ".fc-daygrid-day-frame",
    );

    const dayFrameEls = Array.from(dayFrameElements);

    dayFrameEls.forEach((dayFrameEl: any, elIndex: number) => {
      const dayGridTopEl = dayFrameEl.querySelector(".fc-daygrid-day-top");
      const semesterDotExists = Boolean(
        dayFrameEl.querySelector(".fc-custom-semester-dot"),
      );
      // @ts-ignore
      const dayFrameDate = dayFrameEl.parentElement.getAttribute("data-date");

      if (
        !semesterData ||
        !dayFrameDate ||
        !Array.isArray(semesterData) ||
        semesterDotExists
      )
        return;

      semesterData?.forEach((semester: SemesterType) => {
        if (
          new Date(dayFrameDate) < new Date(semester.start) ||
          new Date(dayFrameDate) > new Date(semester.end)
        )
          return;

        const semesterDot = document.createElement("div");
        semesterDot.classList.add("fc-custom-semester-dot");
        semesterDot.setAttribute("data-course", semester.course);
        semesterDot.setAttribute("data-semester", semester.semester);
        semesterDot.style.backgroundColor = semester.color;
        semesterDot.innerHTML = `
          <div class="semester-tooltip-wrapper">
            <div class="semester-tooltip-data">
              <div class="semester-tooltip-dot" style="background-color: ${semester.color}"></div>
              <span class="semester-tooltip-semTitle">${semester.semester}</span>
            </div>
            <span class="semester-tooltip-course">${semester.course}</span>
          </div>
       `;

        const tooltipDot = semesterDot.querySelector(".semester-tooltip-dot");
        // @ts-ignore
        if (tooltipDot.style.backgroundColor)
          // @ts-ignore
          tooltipDot.style.backgroundColor = `${semester.color}`;

        dayGridTopEl?.appendChild(semesterDot);
      });
    });

    return () => {
      if (!calendarRef.current) return;
      // @ts-ignore
      // eslint-disable-next-line react-hooks/exhaustive-deps
      let allDotElements = calendarRef.current.elRef.current.querySelectorAll(
        ".fc-custom-semester-dot",
      );
      allDotElements = Array.from(allDotElements);
      console.log("allDotElements", allDotElements);

      Array.isArray(allDotElements) &&
        allDotElements?.forEach((dotEl: any) => dotEl.remove());
    };
  }, [calendarRef, semesterData, monthValue, currentView]);
};

const useApplySemesterDotYearly = ({
  calendarRef,
  semesterData,
  monthValue,
  currentView,
}: {
  calendarRef: RefObject<FullCalendar>;
  semesterData: SemesterType[] | undefined;
  monthValue: number | undefined;
  currentView?: string;
}) => {
  return useEffect(() => {
    if (!calendarRef.current || currentView !== "multiMonthYear") return;

    // @ts-ignore
    const titleNodeList = calendarRef.current.elRef.current.querySelectorAll(
      ".fc-multimonth-title",
    );
    const titleEls = Array.from(titleNodeList);
    titleEls.forEach((titleEl: any, i: number) => {
      const semesterWrapper = document.createElement("div");
      semesterWrapper.classList.add("semester-yearly-wrapper");

      semesterData?.forEach((semester: SemesterType) => {
        if (
          !(
            new Date(semester?.start)?.getMonth() >= i &&
            new Date(semester?.end)?.getMonth() <= i
          )
        )
          return;
        const semesterDot = document.createElement("div");
        semesterDot.classList.add("fc-custom-semester-dot");
        semesterDot.setAttribute("data-course", semester.course);
        semesterDot.setAttribute("data-semester", semester.semester);
        semesterDot.style.backgroundColor = semester.color;
        semesterDot.innerHTML = `
          <div class="semester-tooltip-wrapper">
            <div class="semester-tooltip-data">
              <div class="semester-tooltip-dot" style="background-color: ${semester.color}"></div>
              <span class="semester-tooltip-semTitle">${semester.semester}</span>
            </div>
            <span class="semester-tooltip-course">${semester.course}</span>
          </div>
       `;

        const tooltipDot = semesterDot.querySelector(".semester-tooltip-dot");
        // @ts-ignore
        if (tooltipDot.style.backgroundColor)
          // @ts-ignore
          tooltipDot.style.backgroundColor = `${semester.color}`;

        semesterWrapper?.appendChild(semesterDot);
      });

      titleEl.appendChild(semesterWrapper);
    });
  }, [calendarRef, semesterData, monthValue, currentView]);
};

const useApplyYearlySemesterView = ({
  multiMonthEls,
  currentView,
}: {
  multiMonthEls: HTMLDivElement[];
  currentView: string;
}) => {
  return useEffect(() => {
    if (!Boolean(multiMonthEls)) return;
    const multiMonthElsArr = Array.from(multiMonthEls);
    const tbody = multiMonthElsArr[0]
      ?.querySelector("tbody")
      ?.querySelectorAll("tr");
    const trEls = tbody && Array.from(tbody);
    if (!trEls) return;

    console.log("multiMonthElsArr[0]", trEls && trEls[0]);

    const dayCells = trEls[0].querySelectorAll(".fc-daygrid-day");
    dayCells.forEach((cell) => {
      // trEls[0].removeChild(cell);
      if (cell.classList.contains("fc-day-disabled")) return;
      cell.remove();
    });
    const semCell = document.createElement("div");
    semCell.classList.add("fc-semester-cell");
    trEls[0].appendChild(semCell);
    // const parentElement = document.getElementById("parent");
    // const childrenToRemove = parentElement.querySelectorAll(".child");

    // trEls?.forEach(() => {
    //   tbody.removeChild(child);
    // });

    // tbody.
    // const tbody = multi
    // multiMonthElsArr.forEach((monthEl: any) => {
    //   const tbody = monthEl.querySelector("tbody");
    //   tbody.forEach();
    // });
  }, [currentView]);
};
const useGetCalendarApi = (calendarRef: RefObject<FullCalendar>) => {
  const [calendarApi, setCalendarApi] = useState<CalendarApi>();
  useEffect(() => {
    // @ts-ignore
    if (!calendarRef.current) return;
    setCalendarApi(calendarRef.current?.getApi());
  }, [calendarRef]);
  return { calendarApi };
};

export {
  useApplySemesterDot,
  useApplySemesterDotYearly,
  useApplyYearlySemesterView,
  useGetCalendarApi,
};
