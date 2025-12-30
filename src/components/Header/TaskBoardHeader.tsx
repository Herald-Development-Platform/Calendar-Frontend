import React, { useContext, useState } from "react";
import { HiOutlineBell } from "react-icons/hi";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationList } from "../NotificationList";
import { Menu, Router, Search } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import ToggleSidebar from "../Sidebar/ToggleSidebar";
import { Input } from "../ui/input";

interface TaskBoardHeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

export function TaskBoardHeader({ search, setSearch }: TaskBoardHeaderProps) {
  const { userData } = useContext(Context);

  const { notifications } = useContext(Context);

  let newNotifications = false;
  if (notifications) {
    newNotifications = notifications.some((notification: any) => !notification.isRead);
  }

  return (
    <div
      className=" flex h-16
      items-center justify-between px-8 py-8 pt-[3rem]"
    >
      <ToggleSidebar>
        <Menu />
      </ToggleSidebar>
      <h1 className="text-[1.4rem] font-semibold">Boards</h1>

      {/* notification and accounts  */}

      <div className="flex items-center flex-1 justify-end gap-5">
        <div className="relative w-full max-w-[50%]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Task Boards..."
            className="rounded-lg pl-10 h-9"
          />
        </div>
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
    </div>
  );
}
