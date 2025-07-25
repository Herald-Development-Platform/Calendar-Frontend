import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
export default function ToggleSidebar({ children }: { children?: React.ReactNode }) {
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setToggleSidebar(true)}
        className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-300 xl:hidden"
      >
        {children}
      </button>
      <div
        className={`${
          toggleSidebar ? "-translate-x-0" : "-translate-x-full"
        } duration-400 fixed left-0  top-0 z-50  bg-green-500 bg-opacity-50 transition`}
      >
        <Sidebar hasBreakpoint={false}></Sidebar>
      </div>
      <div
        onClick={() => setToggleSidebar(false)}
        className={`${
          toggleSidebar ? "" : "hidden"
        } fixed left-0 top-0 z-40 h-full w-full bg-black bg-opacity-5`}
      ></div>
    </>
  );
}
