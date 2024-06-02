import { CiLogout } from "react-icons/ci";
import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbCalendarEvent } from "react-icons/tb";
import format from "date-fns/format";
import AddEventModal from "../AddEventModal";
import { HiOutlineBell } from "react-icons/hi";
import Image from "next/image";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { CalendarApi } from "@fullcalendar/core/index.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdArrowDropdown } from "react-icons/io";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Endpoints from "@/services/API_ENDPOINTS";

export function HomeHeader() {
  const [redner, setredner] = useState<number>(1);
  const [calendarApi, setCalendarApi] = useState<CalendarApi>();

  const { calendarRef, selectedDate } = useContext(Context);
  console.log("calREf", calendarRef);

  const router = useRouter();
  const date = selectedDate ? selectedDate : new Date();

  // useEffect(() => {
  //   console.log("calendarRef from header component", calendarRef);
  //   console.log("selectedDate header:", selectedDate);
  // }, [calendarRef, selectedDate]);

  // sets value of calendarAPI as soon as calRef loads.
  useEffect(() => {
    // @ts-ignore
    const calApi = calendarRef?.current?.getApi();
    setCalendarApi(calApi);
    console.log("calApi: ", calendarApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRef]);
  const handleNext = () => {
    calendarApi?.next();
  };
  const handlePrevious = () => {
    calendarApi?.prev();
  };
  const handleToday = () => {
    calendarApi?.today();
  };

  return (
    <div className="ml-8 mr-16 mt-8 flex h-12 w-auto justify-between">
      {/* <button onClick={() => setredner(redner + 1)}>
        redner asdfjlksadfj;
      </button> */}
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

          {/* Selected date display */}
          <div className="">
            <h6 className="text-2xl font-bold">
              {format(date, "MMMM d', '")}
              <span className="text-lg font-medium">{date.getFullYear()}</span>
            </h6>
          </div>
        </div>

        {/* month and addEventModal  */}
        <div className="flex w-56 items-center justify-between gap-3 text-sm font-medium">
          <select
            className="h-8 w-24 max-w-xs rounded border border-neutral-300 bg-transparent text-neutral-500 focus:outline-none"
            defaultValue={"month"}
          >
            <option value={"month"}>Month</option>
            <option value={"week"}>Week</option>
            <option value={"year"}>Year</option>
          </select>
          <AddEventModal />
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

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <div className="flex items-center ">
              <Image
                className="h-8 w-8 rounded-full"
                alt={"profile pic"}
                src={"/images/Sidebar/HelpIcon.png"}
                width={32}
                height={32}
              />
              <p className="font-medium text-neutral-600 "></p>
            </div>
            Open <IoMdArrowDropdown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Profile</DropdownMenuLabel>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                Cookies.remove("token");
                router.push(Endpoints.login);
              }}
            >
              <span className="text-xl">
                <CiLogout />
              </span>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
