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
import { MdOutlineSettings } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CgProfile } from "react-icons/cg";

import { IoMdArrowDropdown } from "react-icons/io";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Endpoints from "@/services/API_ENDPOINTS";
import { decryptJwtPayload } from "@/lib/utils";
import { useGetCookieByName } from "@/hooks/CookieHooks";
import { CalendarViews } from "@/constants/CalendarViews";

export function HomeHeader() {
  // const [redner, setredner] = useState<number>(1);
  const [calendarApi, setCalendarApi] = useState<CalendarApi>();

  const { calendarRef, selectedDate } = useContext(Context);
  console.log("calREf", calendarRef);

  const token = useGetCookieByName("token");
  const userData = token ? decryptJwtPayload(token) : null;
  console.log("userData", userData);

  const router = useRouter();
  const date = selectedDate ? selectedDate : new Date();

  console.log("selectedData", selectedDate);

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
          <Select
            onValueChange={(calView) => {
              console.log("calView", calView);
              calendarApi?.changeView(calView);
            }}
            defaultValue={CalendarViews.monthView}
          >
            <SelectTrigger className="h-8 w-24 text-neutral-500 focus:outline-none focus:ring-0">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                className="font-normal text-neutral-500 "
                value={CalendarViews.monthView}
              >
                Months
              </SelectItem>

              <SelectItem
                className="font-normal text-neutral-500 "
                value={CalendarViews.timeGrid.week}
              >
                Week
              </SelectItem>
              <SelectItem
                className="font-normal text-neutral-500 "
                value={CalendarViews.timeGrid.day}
              >
                Day
              </SelectItem>
              <SelectItem
                className="font-normal text-neutral-500 "
                value={CalendarViews.multiMonthView}
              >
                Year
              </SelectItem>
            </SelectContent>
          </Select>

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
            {userData?.username} <IoMdArrowDropdown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuLabel>My Profile</DropdownMenuLabel> */}
            <DropdownMenuItem className="flex gap-2 text-sm font-semibold">
              <span className="text-xl">
                <CgProfile />
              </span>{" "}
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 text-sm font-semibold">
              <span className="text-xl">
                <MdOutlineSettings />
              </span>
              My Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2 text-base font-semibold"
              onClick={() => {
                Cookies.remove("token");
                router.push("/login");
              }}
            >
              <span className="text-xl">
                <IoMdLogOut />
              </span>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// function decodeJwt(token: string) {
//   const base64Url = token.split(".")[1];
//   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   const jsonPayload = base64UrlDecode(base64);
//   return JSON.parse(jsonPayload);
// }
