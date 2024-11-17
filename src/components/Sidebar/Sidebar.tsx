"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosSearch, IoMdArrowDropdown } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineDocumentReport, HiOutlineUserGroup } from "react-icons/hi";
import { useGetSemesters } from "@/services/api/semesters";
import { useContext, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Cookies from "js-cookie";
import "./SideBarCss.css";

import { Context } from "@/app/clientWrappers/ContextProvider";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Axios } from "@/services/baseUrl";
import Endpoints from "@/services/API_ENDPOINTS";
import toast from "react-hot-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { RxCross2 } from "react-icons/rx";
import { PROCUREMENT_URL } from "@/constants";
import { useGetProfile } from "@/services/api/profile";
import { ROLES } from "@/constants/role";

interface ISidebar {
  name: string;
  icon: JSX.Element;
  navigation: string;
}

export default function Sidebar({ hasBreakpoint }: { hasBreakpoint: boolean }) {
  const currentRoute = usePathname();

  const { userData: profile } = useContext(Context);

  console.clear();

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
      icon: (
        <Image
          src={"/SummaryIcon.svg"}
          width={20}
          height={20}
          alt={""}
          className="ml-0.5"
        />
      ),
      navigation: "/summary",
    },
    profile &&
      [ROLES.DEPARTMENT_ADMIN, ROLES.SUPER_ADMIN].includes(profile.role) && {
        name: "Requisition",
        icon: <HiOutlineDocumentReport />,
        navigation: PROCUREMENT_URL + "/",
        // navigation: `${PROCUREMENT_URL}?url_token=${encodeURIComponent(Cookies.get("token") || "")}`,
      },
  ].filter(Boolean) as ISidebar[];

  const { data: semesters, isLoading: semestersLoading } = useGetSemesters();
  const [selectedActiveSemesters, setSelectedActiveSemesters] = useState<
    string[]
  >([]);
  const [ongoingSemesters, setOngoingSemesters] = useState<Semester[]>([]);
  const [tempOngoing, setTempOngoinSemesters] = useState<Semester[]>([]);
  const [ongoingSemestersGrouped, setOngoingSemestersGrouped] = useState<any>(
    {},
  );

  const matchTwoStringArray = (arr1: string[], arr2: string[]) => {
    return (
      arr1.length === arr2.length &&
      arr1.every((v, i) => arr2.find((v2) => v2 === v))
    );
  };

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

      setTempOngoinSemesters(tempOngoing);

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

  useEffect(() => {
    if (profile) {
      setSelectedActiveSemesters(profile.activeSemester ?? []);
    }
  }, [profile]);

  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => {
      return Axios.patch(Endpoints.updateProfile, data);
    },
    mutationKey: ["updateProfile"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ProfileData"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Semesters Preferences Saved Successfully");
    },
  });

  return (
    <>
      <div
        className={`${
          hasBreakpoint ? "custom-hidden relative xl:block " : "block"
        } h-screen ${
          open ? "w-[290px]" : "w-[80px]"
        } duration-400 bg-neutral-50 px-4 py-10 transition-all `}
      >
        <div
          className={`flex h-full w-full flex-col items-center ${
            open ? "gap-14" : "gap-1.5"
          }  font-medium`}
        >
          <span className="absolute -top-2.5 left-[-28px] -rotate-[40deg] bg-red-500 px-6 py-3 pb-0 text-lg text-white">
            Beta
          </span>
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
                  <PopoverClose className="cursor-pointer">
                    <span>
                      <RxCross2 />
                    </span>
                  </PopoverClose>
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
                              className={` ${
                                selectedActiveSemesters?.includes(semester._id)
                                  ? "bg-primary-100"
                                  : "transparent"
                              } flex w-full cursor-pointer items-center gap-3 rounded-md px-2.5 py-1.5`}
                              onClick={() => {
                                setSelectedActiveSemesters((prev) => {
                                  if (prev.includes(semester._id)) {
                                    return prev.filter(
                                      (id) => id != semester._id,
                                    );
                                  } else {
                                    return [...prev, semester._id];
                                  }
                                });
                              }}
                            >
                              <span
                                className={`cursor-pointer ${
                                  selectedActiveSemesters.includes(semester._id)
                                    ? "text-primary-500"
                                    : "text-[#636366]"
                                }`}
                              >
                                {selectedActiveSemesters.includes(
                                  semester._id,
                                ) ? (
                                  <MdCheckBox />
                                ) : (
                                  <MdCheckBoxOutlineBlank />
                                )}
                              </span>
                              <div
                                className="h-[30px] w-[30px] rounded-md "
                                style={{ backgroundColor: semester.color }}
                              ></div>
                              <div className="flex flex-col gap-0">
                                <span className="text-[13px] font-semibold text-neutral-900">
                                  {semester.semester}
                                </span>
                                <span className="text-[11px] font-medium text-neutral-600">
                                  {new Date(semester.start).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}{" "}
                                  -{" "}
                                  {new Date(semester.end).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ),
                  )}
                  <div className="flex w-full items-center justify-between">
                    <span
                      onClick={() => {
                        if (
                          selectedActiveSemesters.length === tempOngoing.length
                        ) {
                          if (
                            profile?.activeSemester?.length ===
                            tempOngoing.length
                          ) {
                            setSelectedActiveSemesters([]);
                          } else {
                            setSelectedActiveSemesters([
                              ...(profile?.activeSemester ?? []),
                            ]);
                          }
                        } else {
                          let ongoingSemestersIds = tempOngoing.map(
                            (semester) => semester?._id ?? "",
                          );
                          setSelectedActiveSemesters(ongoingSemestersIds);
                          console.log("ONGOING::::", ongoingSemestersIds);
                        }
                      }}
                      className={`flex cursor-pointer items-center justify-start gap-3 pl-2.5 ${
                        selectedActiveSemesters.length === tempOngoing.length
                          ? "text-primary-500"
                          : "text-[#636366]"
                      }`}
                    >
                      {selectedActiveSemesters.length === tempOngoing.length ? (
                        <MdCheckBox />
                      ) : (
                        <MdCheckBoxOutlineBlank />
                      )}
                      <span className="text-[13px]">All</span>
                    </span>
                    <div className="flex flex-row items-center justify-end gap-2.5 px-8 py-4">
                      {!matchTwoStringArray(
                        profile?.activeSemester ?? [],
                        selectedActiveSemesters,
                      ) && (
                        <>
                          <button
                            onClick={() => {
                              updateProfileMutation.mutate({
                                activeSemester: selectedActiveSemesters,
                              });
                            }}
                            className="rounded-[4px] bg-primary-600 px-4 py-2.5 text-[13px] text-neutral-50 transition-all duration-200 hover:bg-primary-700"
                          >
                            Save Changes
                          </button>
                          <PopoverClose
                            onClick={() => {
                              setSelectedActiveSemesters([
                                ...(profile?.activeSemester ?? []),
                              ]);
                            }}
                          >
                            <button
                              onClick={() => {
                                setSelectedActiveSemesters([
                                  ...(profile?.activeSemester ?? []),
                                ]);
                              }}
                              className="rounded-[4px] bg-danger-500 px-4 py-2.5 text-[13px] text-neutral-50 transition-all duration-200 hover:bg-danger-600"
                            >
                              Discard
                            </button>
                          </PopoverClose>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
}
