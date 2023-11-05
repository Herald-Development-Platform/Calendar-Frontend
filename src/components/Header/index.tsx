import React, { Dispatch, SetStateAction } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbCalendarEvent } from "react-icons/tb";
import format from "date-fns/format";
import AddEventModal from "../AddEventModal";
import { HiOutlineBell } from "react-icons/hi";
import Image from "next/image";
import { addMonths, subMonths } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import { RefObject } from "@fullcalendar/core/preact.js";

export default function Header({
  date,
  setDate,
  calendarRef,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  calendarRef: RefObject<FullCalendar | null>;
}) {
  const handleNext = () => {
    // const newDate = addMonths(date, 1);
    // console.log("newDate", newDate);
    // setDate(newDate);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };
  const handlePrevious = () => {
    // setDate(subMonths(date, 1));
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };
  const handleToday = () => {
    // setDate(new Date());
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    }
  };

  return (
    <div className="ml-8 mt-8 flex h-12 w-10/12 justify-between ">
      <div className="flex w-9/12 justify-between">
        {/* Navigation btns and Date */}
        <div className="flex w-auto items-center gap-3 text-neutral-900">
          <div className="flex w-16 justify-between">
            <div
              className="tooltip tooltip-bottom h-6 w-6"
              data-tip="Previous Month"
            >
              <button onClick={handlePrevious} className="">
                <IoIosArrowBack className="h-6 w-6 text-neutral-500" />
              </button>
            </div>
            <div
              className="tooltip tooltip-bottom h-6 w-6"
              data-tip="Next Month"
            >
              <button onClick={handleNext} className="">
                <IoIosArrowForward className="h-6 w-6 text-neutral-500" />
              </button>
            </div>
          </div>
          <div className="tooltip tooltip-bottom h-6 w-6" data-tip="Today">
            <button onClick={handleToday} className="">
              <TbCalendarEvent className="h-6 w-6 text-neutral-500" />
            </button>
          </div>
          <div className="">
            <h6 className="text-2xl font-bold">
              {format(date, "MMMM d', '")}
              <span className="text-lg font-medium">{date.getFullYear()}</span>
            </h6>
          </div>
        </div>

        {/* month and addEventModal  */}
        <div className="flex w-56 items-center justify-between text-sm font-medium">
          <select className="h-8 w-24 max-w-xs rounded border border-neutral-300 bg-transparent text-neutral-500 focus:outline-none  ">
            <option selected>Month</option>
            <option>Week</option>
            <option>Year</option>
          </select>
          <AddEventModal allEvents={{}} setAllEvents={{}} />
        </div>
      </div>

      {/* notification and accounts  */}
      <div className="flex">
        <details className="dropdown">
          <summary className="btn border-none bg-transparent text-xl">
            <HiOutlineBell />
          </summary>
          <ul className="menu dropdown-content rounded-box z-[1] w-52 bg-base-100 p-2 shadow">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </details>
        <div className="flex items-center ">
          <Image
            className="h-8 w-8 rounded-full"
            alt={"profile pic"}
            src={"/images/Sidebar/HelpIcon.png"}
            width={32}
            height={32}
          />
          <p className="font-medium text-neutral-600 ">Samip M.</p>
        </div>
      </div>
    </div>
  );
}
