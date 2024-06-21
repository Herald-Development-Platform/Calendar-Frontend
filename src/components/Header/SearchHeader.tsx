import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { HiOutlineBell } from "react-icons/hi";
import Image from "next/image";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { IoIosSearch } from "react-icons/io";
import { NotificationList } from "../NotificationList";

export function SearchHeader({
  queryParams,
  handleQueryParams,
}: {
  queryParams: eventByParamsType;
  handleQueryParams: (e: any) => void;
}) {
  let timeout;
  const { calendarRef, selectedDate, userData } = useContext(Context);

  const date = selectedDate ? selectedDate : new Date();

  // @ts-ignore
  //   const calendarApi = calendarRef?.current?.getApi();

  return (
    <div className=" flex h-12 w-[95%] justify-between">
      <div className="flex w-9/12 justify-between">
        {/* Navigation btns and Date */}
        {/* <div className="flex w-auto items-center gap-3 text-neutral-900"> */}
        <label htmlFor="add-title" className="w-9/12">
          <div className="group flex h-11 w-full items-center gap-2  rounded-full border-[1px] border-primary-50 bg-neutral-100 px-4 focus-within:border-primary-600">
            <span className="text-xl">
              <IoIosSearch />
            </span>
            <input
              type="text"
              className="w-full bg-neutral-100 text-sm font-medium text-neutral-500 outline-none"
              placeholder="Search events, dates, participants..."
              id="add-title"
              value={queryParams?.q}
              onChange={handleQueryParams}
            />
          </div>
        </label>
        {/* </div> */}
      </div>

      {/* notification and accounts  */}
      <div className="flex">
        <NotificationList className="" />
        <div className="flex items-center ">
          {console.log("Profile Pic", userData?.photo) === null ? (
            <div></div>
          ) : (
            <div></div>
          )}
          <Image
            className="h-8 w-8 rounded-full"
            alt={"profile pic"}
            src={userData?.photo ?? "/images/Sidebar/HelpIcon.png"}
            width={32}
            height={32}
          />
          <p className="font-medium text-neutral-600 "></p>
        </div>
      </div>
    </div>
  );
}
