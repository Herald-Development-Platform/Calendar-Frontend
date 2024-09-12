import { CalendarApi } from "@fullcalendar/core/index.js";
import { RefObject } from "@fullcalendar/core/preact.js";
import FullCalendar from "@fullcalendar/react";
import { format, parse } from "date-fns";
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

const useApplyHighlightOrOngoing = ({
  monthValue,
  userData,
  semesterData,
  calendarRef,
  dayFrameRefs,
}: {
  monthValue: number | undefined;
  userData: User | undefined;
  semesterData: SemesterType[] | undefined;
  calendarRef: RefObject<FullCalendar> | undefined;
  dayFrameRefs: RefObject<HTMLDivElement[]>;
}) => {
  return useEffect(() => {
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
    const dayFrameEls = Array.from(
      dayFrameRefs.current as ArrayLike<HTMLDivElement>,
    );

    dayFrameEls.forEach((dayFrameEl: HTMLDivElement) => {
      const dayGridNumber = dayFrameEl.querySelector(".fc-daygrid-day-number");
      const ariaLabelValue = dayGridNumber?.getAttribute("aria-label");

      if (!ariaLabelValue) return;

      const parsedDate: Date = parse(
        ariaLabelValue,
        "MMMM d, yyyy",
        new Date(),
      );
      const isoDate = format(parsedDate, "yyyy-MM-dd");

      // const isHighLight = userData?.importantDates?.includes(

      //   new Date(isoDate)?.toISOString(),
      // );
      const isHighLight = userData?.importantDates?.includes(
        // @ts-ignore
        parsedDate.toISOString(),
      );

      const isOngoing = semTimeFrame?.some((sem: any) => {
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
function isMultiDay(date1: number, date2: number) {
  const oneDayInMs = 24 * 60 * 60 * 1000;
  return Math.abs(date1 - date2) > oneDayInMs;
}

export {
  useApplySemesterDot,
  useApplySemesterDotYearly,
  useApplyYearlySemesterView,
  useGetCalendarApi,
  isMultiDay,
  useApplyHighlightOrOngoing,
};
