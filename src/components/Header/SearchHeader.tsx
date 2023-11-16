import React, { useContext, useEffect } from "react";
import { HiOutlineBell } from "react-icons/hi";
import Image from "next/image";
import { Context } from "@/app/ContextProvider";
import { IoIosSearch } from "react-icons/io";

export function SearchHeader() {
  const { calendarRef, selectedDate } = useContext(Context);

  const date = selectedDate ? selectedDate : new Date();

  // @ts-ignore
  //   const calendarApi = calendarRef?.current?.getApi();

  return (
    <div className="ml-8 mt-8 flex h-12 w-[95%] justify-between">
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
              // value={newEvent.title}
              // onChange={(e) =>
              //   setNewEvent({ ...newEvent, title: e.target.value })
              // }
            />
          </div>
        </label>
        {/* </div> */}
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
          <p className="font-medium text-neutral-600 ">Samip Maharjan</p>
        </div>
      </div>
    </div>
  );
}
