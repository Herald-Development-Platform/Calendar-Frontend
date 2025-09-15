import React, { useContext, useState } from "react";
import { HiOutlineBell } from "react-icons/hi";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationList } from "../NotificationList";
import { Menu, Router } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import ToggleSidebar from "../Sidebar/ToggleSidebar";

export function TaskHeader() {
  const { userData } = useContext(Context);



  const { notifications } = useContext(Context);

  let newNotifications = false;
  if (notifications) {
    newNotifications = notifications.some((notification: any) => !notification.isRead);
  }

  return (
    <div
      className=" flex h-16
      items-center justify-between px-8 pt-[3.8rem] py-12"
    >
      <ToggleSidebar>
        <Menu />
      </ToggleSidebar>
      <h1 className="font-semibold text-[1.6rem]">
        Task Management Board
      </h1>

      {/* notification and accounts  */}
      <div className="flex flex-row items-center gap-4">
        <Popover>
          <PopoverTrigger>
            <span className="relative text-xl text-neutral-600">
              {newNotifications && (
                <div>
                  <div className="absolute right-0 top-0 min-h-[10px] min-w-[10px] rounded-full bg-[#FA3E3E]"></div>
                </div>
              )}
              <HiOutlineBell />
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-[600px]" align="end">
            <NotificationList />
          </PopoverContent>
        </Popover>
        <ProfileDropdown userData={userData} />
      </div>
    </div>
  );
}
