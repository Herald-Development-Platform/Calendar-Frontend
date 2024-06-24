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
import { MdListAlt } from "react-icons/md";
import { Toggle } from "@/components/ui/toggle";

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
import {
  checkListView,
  decryptJwtPayload,
  findListView,
  findNormalView,
} from "@/lib/utils";
import { useGetCookieByName } from "@/hooks/CookieHooks";
import { CalendarViews, ListViews } from "@/constants/CalendarViews";
import { CgList } from "react-icons/cg";
import { NotificationList } from "../NotificationList";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";

export function HomeHeader() {
  // const [redner, setredner] = useState<number>(1);
  const [calendarApi, setCalendarApi] = useState<CalendarApi>();
  const [listView, setListView] = useState<boolean>(false);

  const { calendarRef,userData, selectedDate, setSelectedDate, timeout } =
    useContext(Context);

  const token = useGetCookieByName("token");

  const router = useRouter();
  const date = selectedDate ? selectedDate : null;

  console.log("selectedData", selectedDate);

  // sets value of calendarAPI as soon as calRef loads.
  useEffect(() => {
    // @ts-ignore
    const calApi = calendarRef?.current?.getApi();
    setCalendarApi(calApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRef]);

  const handleNext = () => {
    calendarApi?.next();
    setSelectedDate((prev: any) => {
      if (!prev?.start) return prev;

      const nextMonth = new Date(prev.start);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return {
        start: nextMonth,
        end: nextMonth,
        endStr: "",
        startStr: "",
      };
    });
    clearTimeout(timeout.current);
  };

  const handlePrevious = () => {
    calendarApi?.prev();
    setSelectedDate((prev: any) => {
      if (!prev?.start) return prev;

      const nextMonth = new Date(prev.start);
      nextMonth.setMonth(nextMonth.getMonth() - 1);
      return {
        start: nextMonth,
        end: nextMonth,
        endStr: "",
        startStr: "",
      };
    });
    clearTimeout(timeout.current);
  };

  const handleToday = () => {
    calendarApi?.today();
    setSelectedDate({
      start: new Date(),
      end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
    });
  };

  useHandleListViewToggle(listView, calendarApi);
  return (
    <div className="ml-8 mr-16 mt-8 flex h-12 w-auto items-center justify-between">
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
              {selectedDate?.start && format(selectedDate.start, "MMMM d', '")}
              <span className="text-lg font-medium">
                {selectedDate?.start?.getFullYear()}
              </span>
            </h6>
          </div>
        </div>

        {/* listview, month and addEventModal  */}
        <div className="flex max-h-8 w-56 items-center justify-between gap-3 text-sm font-medium">
          <button
            className={`${
              listView ? "bg-primary-500 text-white" : "text-neutral-500"
            } h-full w-32 rounded-sm border border-neutral-300 px-3 text-2xl font-semibold transition duration-200 `}
            onClick={(e) => {
              setListView((prev) => !prev);
              console.log("listview", listView);
              // calendarApi?.view?.type &&
              //   findListView(calendarApi.view.type, calendarApi);
            }}
          >
            <MdListAlt />
          </button>
          <Select
            onValueChange={(calView) => {
              if (listView && calendarApi)
                return findListView(calView, calendarApi);
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
      <div className="flex flex-row items-center gap-4">
        <Popover>
          <PopoverTrigger>
            <span className="text-xl text-neutral-600">
              <HiOutlineBell />
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-[600px]" align="end">
            <NotificationList />
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <div className="flex items-center ">
              <Image
                className="h-8 w-8 rounded-full"
                alt={"profile pic"}
                src={userData?.photo ?? "/images/Sidebar/HelpIcon.png"}
                width={32}
                height={32}
              />
              <p className="font-medium text-neutral-600 "></p>
            </div>
            {userData?.username} <IoMdArrowDropdown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Profile</DropdownMenuLabel>
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
const useHandleListViewToggle = (
  listView: boolean,
  calendarApi: CalendarApi | undefined,
) => {
  useEffect(() => {
    if (!calendarApi) return;
    if (listView) {
      findListView(calendarApi.view.type, calendarApi);
    } else {
      findNormalView(calendarApi.view.type, calendarApi);
    }
  }, [listView]);
};
