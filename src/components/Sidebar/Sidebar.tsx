"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosSearch, IoMdArrowDropdown } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineDocumentReport, HiOutlineUserGroup } from "react-icons/hi";
import { useGetSemesters } from "@/services/api/semesters";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaCheck } from "react-icons/fa";

import "./SideBarCss.css";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { RxCross1 } from "react-icons/rx";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { GoSidebarCollapse } from "react-icons/go";
import { BsLayoutSidebarReverse } from "react-icons/bs";

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
      name: "Summary",
      icon: <HiOutlineDocumentReport />,
      navigation: "/summary",
    },
  ];

  const { data: semesters, isLoading: semestersLoading } = useGetSemesters();
  const [ongoingSemesters, setOngoingSemesters] = useState<Semester[]>([]);
  const [ongoingSemestersGrouped, setOngoingSemestersGrouped] = useState<any>(
    {},
  );
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (semesters) {
      let tempOngoing: Semester[] = [];
      let currnetDate = new Date();
      tempOngoing = semesters?.data?.data?.filter((semester: any) => {
        let startDate = new Date(semester.start);
        let endDate = new Date(semester.end);
        return startDate <= currnetDate && endDate >= currnetDate;
      });

      let uniqueOngoings: Semester[] = [];
      for (let i = 0; i < tempOngoing.length; i++) {
        if (
          uniqueOngoings.find(
            (semester) => semester.semester == tempOngoing[i].semester,
          )
        ) {
          uniqueOngoings = uniqueOngoings.map((semester) => {
            if (semester.semester == tempOngoing[i].semester) {
              return {
                ...semester,
                course: semester.course + ", " + tempOngoing[i].course,
              };
            } else {
              return semester;
            }
          });
        } else {
          uniqueOngoings.push(tempOngoing[i]);
        }
      }
      setOngoingSemesters(uniqueOngoings);
      let grouped: any = {};
      tempOngoing.forEach((sem) => {
        if (grouped[sem.course]) {
          grouped[sem.course].push(sem);
        } else {
          grouped[sem.course] = [sem];
        }
      });
      setOngoingSemestersGrouped(grouped);
    }
  }, [semesters]);

  const [semestersDialogOpen, setSemestersDialogOpen] = useState(false);

  return (
    <>
      <div
        className={`${hasBreakpoint ? "relative hidden" : " block"} h-screen ${
          open ? "w-[290px]" : "w-[80px]"
        } duration-400 bg-neutral-50 px-4 py-10 transition-all xl:block`}
      >
        <div
          className={`flex h-full w-full flex-col items-center ${
            open ? "gap-14" : " gap-1.5"
          }  font-medium`}
        >
          <div
            className={`flex ${
              open ? "flex-row" : "flex-col"
            } w-full items-center gap-3 text-lg font-medium text-neutral-600 `}
          >
            <Image
              width={32}
              height={32}
              src={"/images/heraldLogo.svg"}
              alt="HeraldLogo"
              className="mb-1"
            />
            {open && (
              <>
                <span className="min-w-[130px] text-[16px] ">
                  Events Calendar
                </span>
                {/* <span
                  className={`${open ? "ml-auto rotate-180" : " absolute top-20"} cursor-pointer text-2xl font-thin text-neutral-500`}
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  <BsLayoutSidebarReverse />
                </span> */}
                <Image
                  onClick={() => {
                    setOpen(!open);
                  }}
                  width={20}
                  height={17}
                  src={"/sidebarButton.svg"}
                  alt="Sidebar"
                  className=" ml-auto rotate-180 cursor-pointer"
                />
              </>
            )}
          </div>

          <div className="flex w-full flex-col gap-3">
            {!open && (
              <div
                onClick={() => {
                  setOpen(!open);
                }}
                className={`${nonHighlightedStyles}`}
              >
                {/* <span
                  className={`cursor-pointer text-2xl font-thin text-neutral-500`}
                >
                  <BsLayoutSidebarReverse />
                </span> */}
                <Image
                  width={20}
                  height={17}
                  src={"/sidebarButton.svg"}
                  alt="Sidebar"
                  onClick={() => {
                    setOpen(!open);
                  }}
                  className="mb-1 cursor-pointer"
                />
              </div>
            )}
            {sidebarItems.map((item, i) => (
              <Link
                href={item.navigation}
                className={`
                  ${
                    currentRoute == item.navigation
                      ? highlightedStyles
                      : nonHighlightedStyles
                  }
                    `}
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
                {open && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
          <div className="mt-auto">
            <Popover>
              <PopoverTrigger>
                <div
                  className={`mx-2 mt-auto flex ${
                    open ? "w-full" : "w-fit"
                  } duration-400 flex-row items-center justify-between rounded-[50px] border-[0.6px] border-[#D4D4D4] px-4 py-2.5 transition-all `}
                >
                  {semestersLoading ? (
                    <span className="text-sm text-neutral-300">Loading...</span>
                  ) : (
                    <>
                      {open && (
                        <div className="flex flex-col gap-0">
                          <span className="text-[15px] font-medium leading-none text-neutral-600">
                            Ongoing Semesters
                          </span>
                          <div className="flex flex-row items-center gap-1.5 font-medium text-neutral-500">
                            <span className="text-[12px]">
                              {Object.keys(ongoingSemestersGrouped).reduce(
                                (acc, val) =>
                                  acc + ongoingSemestersGrouped[val].length,
                                0,
                              )}{" "}
                              •
                            </span>
                            <div className="flex flex-row items-center gap-[1px]">
                              {ongoingSemesters?.map(
                                (semester: any, i: number) => (
                                  <div
                                    key={i}
                                    className="fc-custom-semester-dot"
                                    style={{ backgroundColor: semester.color }}
                                    onClick={() => {}}
                                  >
                                    <div className="semester-tooltip-wrapper-center">
                                      <div className="semester-tooltip-data">
                                        <div
                                          className="semester-tooltip-dot"
                                          style={{
                                            backgroundColor: semester.color,
                                          }}
                                        ></div>
                                        <span className="semester-tooltip-semTitle">
                                          {semester.semester}
                                        </span>
                                      </div>
                                      <span className="semester-tooltip-course">
                                        {semester.course}
                                      </span>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <span className="-rotate-90 cursor-pointer text-neutral-500">
                        <IoMdArrowDropdown />
                      </span>
                    </>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="flex h-fit min-w-[45vw] translate-x-[230px] translate-y-7 flex-col items-start justify-start gap-5"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-[19px] font-medium text-neutral-900">
                    Ongoing Semesters
                  </span>
                </div>
                <div className="flex flex-row flex-wrap gap-5">
                  {Object.keys(ongoingSemestersGrouped).map(
                    (course, i: number) => (
                      <div
                        key={i}
                        className="flex w-[20vw] flex-col items-start justify-start gap-2.5"
                      >
                        <span className="text-[13px] font-semibold text-neutral-600">
                          {course}
                        </span>
                        {ongoingSemestersGrouped[course].map(
                          (semester: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 px-2.5 py-1.5"
                            >
                              <div
                                className="flex h-[30px] w-[30px] items-center justify-center rounded-md text-white"
                                style={{ backgroundColor: semester.color }}
                              ></div>
                              <div className="flex flex-col gap-0">
                                <span className="text-[13px] font-semibold text-neutral-900">
                                  {semester.semester}
                                </span>
                                <span className="text-[11px] font-medium text-neutral-600">
                                  {new Date(
                                    semester.start,
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(semester.end).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ),
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
}
