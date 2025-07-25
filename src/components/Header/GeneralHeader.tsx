import { HiOutlineBell } from "react-icons/hi";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { NotificationList } from "../NotificationList";
import ProfileDropdown from "./ProfileDropdown";
import Link from "next/link";
import ToggleSidebar from "../Sidebar/ToggleSidebar";
import { Menu } from "lucide-react";
import { useContext } from "react";
import { Context } from "@/app/clientWrappers/ContextProvider";
import HeraldLogo from "@/imgs/images/heraldLogo.svg";

export function GeneralHeader({ className }: { className?: string }) {
  const { notifications, userData } = useContext(Context);

  let newNotifications = false;
  if (notifications) {
    newNotifications = notifications.some((notification: any) => !notification.isRead);
  }

  return (
    <div
      className={`mx-4 mt-8 flex h-12 w-auto items-center justify-end md:ml-8 md:mr-16 ${className}`}
    >
      <div className="mr-auto flex items-center justify-between gap-2 xl:hidden">
        <ToggleSidebar>
          <Menu />
        </ToggleSidebar>

        <Link href={"/"} className="h-fit w-fit">
          <Image
            src={HeraldLogo}
            width={32}
            height={32}
            // className="rounded-xs"
            alt="Herald Logo"
          />
        </Link>
      </div>

      {/* notification and accounts  */}
      <div className="flex flex-row items-center gap-4 ">
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
