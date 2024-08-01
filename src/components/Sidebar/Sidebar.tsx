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

import "./SideBarCss.css";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { RxCross1 } from "react-icons/rx";

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
      <Dialog open={semestersDialogOpen} onOpenChange={setSemestersDialogOpen}>
        <DialogContent className="flex h-fit w-full min-w-[45vw] flex-col items-start justify-start gap-5">
          <div className="flex w-full items-center justify-between">
            <span className="text-[19px] font-medium text-neutral-900">
              Ongoing Semesters
            </span>
            <span
              className="cursor-pointer"
              onClick={() => {
                setSemestersDialogOpen(false);
              }}
            >
              <RxCross1 />
            </span>
          </div>
          <div className="flex flex-row flex-wrap gap-5">
            {Object.keys(ongoingSemestersGrouped).map((course, i: number) => (
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
                        className="h-[30px] w-[30px] rounded-md "
                        style={{ backgroundColor: semester.color }}
                      ></div>
                      <div className="flex flex-col gap-0">
                        <span className="text-[13px] font-semibold text-neutral-900">
                          {semester.semester}
                        </span>
                        <span className="text-[11px] font-medium text-neutral-600">
                          {new Date(semester.start).toLocaleDateString()} -{" "}
                          {new Date(semester.end).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
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

          <div
            onClick={() => {
              setSemestersDialogOpen(true);
            }}
            className="mx-2 mt-auto flex w-full flex-row items-center justify-between rounded-[50px] border-[0.6px] border-[#D4D4D4] px-4 py-2.5 "
          >
            {semestersLoading ? (
              <span className="text-sm text-neutral-300">Loading...</span>
            ) : (
              <>
                <div className="flex flex-col gap-0">
                  <span className="text-[15px] font-medium leading-none text-neutral-600">
                    Ongoing Semesters
                  </span>
                  <div className="flex flex-row items-center gap-1.5 font-medium text-neutral-500">
                    <span className="text-[12px]">
                      {ongoingSemesters?.length} •
                    </span>
                    <div className="flex flex-row items-center gap-[1px]">
                      {ongoingSemesters?.map((semester: any, i: number) => (
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
                                style={{ backgroundColor: semester.color }}
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
                      ))}
                    </div>
                  </div>
                </div>
                <span className="-rotate-90 text-neutral-500">
                  <IoMdArrowDropdown />
                </span>
              </>
            )}
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
