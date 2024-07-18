"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineDocumentReport, HiOutlineUserGroup } from "react-icons/hi";
import { MdImportExport } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { VscLocation } from "react-icons/vsc";

export default function Sidebar({ hasBreakpoint }: { hasBreakpoint: boolean }) {
  const currentRoute = usePathname();

  const highlightedStyles =
    "flex h-11 w-full items-center gap-2 rounded px-3 bg-primary-100 text-primary-700";
  const nonHighlightedStyles =
    "flex h-11 w-full items-center gap-2 rounded px-3 text-neutral-500";

  const sidebarItems = [
    {
      name: "Home",
      icon: <AiOutlineHome />,
      navigation: "/",
    },
    {
      name: "Search",
      icon: <IoIosSearch />,
      navigation: "/search",
    },
    {
      name: "Members",
      icon: <HiOutlineUserGroup />,
      navigation: "/members",
    },
    {
      name: "Import/Export",
      icon: <MdImportExport />,
      navigation: "/importExport",
    },
    {
      name: "Location",
      icon: <VscLocation />,
      navigation: "/location",
    },
    {
      name: "Summary",
      icon: <HiOutlineDocumentReport />,
      navigation: "/summary",
    },
  ];
  return (
    <>
      <div
        className={`${hasBreakpoint ? "relative hidden" : " block"}  
    h-screen w-60 bg-neutral-50 px-4 py-10 transition duration-1000 xl:block`}
      >
        <div className="flex h-full w-[213px] flex-col items-center gap-16  font-medium">
          <div className="flex gap-3 text-lg font-medium text-neutral-600 ">
            <Image
              width={32}
              height={32}
              src={"/images/LoginPage/HeraldLogo.png"}
              alt="HeraldLogo"
            />
            Events Calendar
          </div>

          <div className="flex w-full flex-col gap-3">
            {sidebarItems.map((item, i) => (
              <Link
                onClick={() => console.log("clicked")}
                href={item.navigation}
                className={
                  currentRoute == item.navigation
                    ? highlightedStyles
                    : nonHighlightedStyles
                }
                // className="text-primary-700"
                key={i}
              >
                <span
                  className={
                    currentRoute == item.navigation
                      ? "text-2xl text-primary-700"
                      : "text-2xl text-neutral-500"
                  }
                >
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* <button
          onClick={() => console.log("clicked")}
          className="absolute bottom-10 flex h-11 w-[213px] items-center gap-2 rounded px-3 text-neutral-500 focus:bg-primary-100"
        >
          <Image
            width={"18"}
            height={"18"}
            className="h-[18px] w-[18px]"
            src={"/images/Sidebar/HelpIcon.png"}
            alt={"Help and Support"}
          />
          <span>Help and Support</span>
        </button> */}
      </div>
      {/* <span className="bg-yellow-500 text-4xl"> */}
      {/* <CiLocationOn
        style={{ color: "red" }}
        className="text-4xl text-yellow-500"
      /> */}
      {/* </span> */}
    </>
  );
}
