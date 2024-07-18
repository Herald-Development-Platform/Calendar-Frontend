import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { IoMdArrowDropdown, IoMdLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSettings } from "react-icons/md";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ProfileDropdown({ userData }: { userData: User }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <div className="flex items-center ">
          <Image
            className="h-8 w-8 rounded-full"
            alt={"profile pic"}
            src={userData?.photo ?? "/DummyProfile.jpg"}
            width={32}
            height={32}
          />
          <p className="font-medium text-neutral-600 "></p>
        </div>
        {userData?.username} <IoMdArrowDropdown />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            router.push("/profile");
          }}
          className="flex cursor-pointer gap-2 text-sm font-semibold"
        >
          <span className="text-xl">
            <MdOutlineSettings />
          </span>
          Profile and Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer gap-2 text-base font-semibold"
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
  );
}
