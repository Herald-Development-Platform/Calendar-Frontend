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
import { Bug } from "lucide-react";

import defaultPfp from "@/imgs/DummyProfile.jpg";

export default function ProfileDropdown({ userData }: { userData: User | undefined }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <div className="flex items-center ">
          <Image
            className="h-8 w-8 rounded-full"
            alt={"profile pic"}
            src={userData?.photo ?? defaultPfp}
            width={32}
            height={32}
          />
          <p className="font-medium text-neutral-600 "></p>
        </div>
        <span className="hidden md:inline-block">{userData?.username}</span> <IoMdArrowDropdown />
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
            const pathsToTry = [
              "/",
              "/calendarTesting",
              "/calendarTesting/procurement",
              process.env.DOMAIN_PREFIX,
              `${process.env.DOMAIN_PREFIX}/procurement`,
            ];

            Object.keys(Cookies.get()).forEach(function (cookieName) {
              pathsToTry.forEach(function (path) {
                Cookies.remove(cookieName, { path: path });
              });
            });
            sessionStorage.clear();
            localStorage.clear();

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
