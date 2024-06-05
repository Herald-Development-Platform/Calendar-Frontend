import React, { useContext, useEffect } from "react";
import { HiOutlineBell } from "react-icons/hi";
import Image from "next/image";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { IoIosSearch } from "react-icons/io";

export function DepartmentHeader() {
  const { calendarRef, selectedDate } = useContext(Context);

  const date = selectedDate ? selectedDate : new Date();

  // @ts-ignore
  //   const calendarApi = calendarRef?.current?.getApi();

  return (
    <div className="ml-8 mt-8 flex h-12 w-[95%] justify-between">
      <h1 style={{fontSize:"2em"}}>Departments Management</h1>

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
          <p className="font-medium text-neutral-600 "></p>
        </div>
      </div>
    </div>
  );
}
