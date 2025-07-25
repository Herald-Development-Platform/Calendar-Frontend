"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { IoIosSearch, IoMdArrowDropdown } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineDocumentReport, HiOutlineUserGroup } from "react-icons/hi";
import { useGetSemesters } from "@/services/api/semesters";
import { useContext, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import "./SideBarCss.css";

import { Context } from "@/app/clientWrappers/ContextProvider";
import { MdCheckBox, MdCheckBoxOutlineBlank, MdOutlineFindInPage } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Axios } from "@/services/baseUrl";
import Endpoints from "@/services/API_ENDPOINTS";
import toast from "react-hot-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { RxCross2 } from "react-icons/rx";
import { Bug, ChevronLeft, ChevronRight } from "lucide-react";
import { PERMISSIONS, PROCUREMENT_PERMISSIONS } from "@/constants/permissions";
import { FaAddressCard } from "react-icons/fa6";
import SummaryIcon from "@/imgs/SummaryIcon.svg";
import sidebarIcon from "@/imgs/sidebarButton.svg";
import { IoHomeOutline, IoNewspaperOutline } from "react-icons/io5";
import HeraldLogo from "@/imgs/images/heraldLogo.svg";
import { cn } from "@/lib/utils";
import { FaTasks } from "react-icons/fa";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { PiCertificateBold } from "react-icons/pi";
import { CiBoxes } from "react-icons/ci";

interface ISidebar {
  name: string;
  icon: JSX.Element;
  navigation: string;
}

export default function Sidebar({ hasBreakpoint }: { hasBreakpoint: boolean }) {
  const currentRoute = usePathname();
  const { userData: profile } = useContext(Context);

  const [open, setOpen] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  const sidebarItems = [
    {
      name: "Home",
      icon: <IoHomeOutline strokeWidth={2} />,
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
      icon: <IoNewspaperOutline />,
      navigation: "/summary",
    },
    {
      name: "Tasks",
      icon: <FaTasks size={18} />,
      navigation: "/task",
    },
    profile?.permissions?.some(permission => PROCUREMENT_PERMISSIONS.includes(permission)) && {
      name: "Requisition",
      icon: <CiBoxes strokeWidth={1} size={22} />,
      navigation: "/procurement",
    },
    profile?.permissions?.includes(PERMISSIONS.GENERATE_CERTIFICATE) && {
      name: "Certificate",
      icon: <PiCertificateBold />,
      navigation: "/certificate_",
    },
  ].filter(Boolean) as ISidebar[];

  const { data: semesters, isLoading: semestersLoading } = useGetSemesters();
  const [selectedActiveSemesters, setSelectedActiveSemesters] = useState<string[]>([]);
  const [ongoingSemesters, setOngoingSemesters] = useState<Semester[]>([]);
  const [tempOngoing, setTempOngoinSemesters] = useState<Semester[]>([]);
  const [ongoingSemestersGrouped, setOngoingSemestersGrouped] = useState<any>({});

  const matchTwoStringArray = (arr1: string[], arr2: string[]) => {
    return arr1.length === arr2.length && arr1.every((v, i) => arr2.find(v2 => v2 === v));
  };

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
        if (uniqueOngoings.find(semester => semester.semester == tempOngoing[i].semester)) {
          uniqueOngoings = uniqueOngoings.map(semester => {
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
      tempOngoing.forEach(sem => {
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
        className={`${hasBreakpoint ? "custom-hidden relative xl:block " : "block"} h-screen ${
          open ? "w-[290px]" : "w-[80px]"
        } border-r border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-xl transition-all duration-300 ease-in-out`}
        style={{
          background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        }}
      >
        <div
          className={`flex h-full w-full flex-col items-center ${
            open ? "gap-8" : "gap-4"
          } relative font-medium`}
        >
          {/* Beta Badge
          <div className="absolute -top-1 left-[-20px] z-10">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1 text-xs font-semibold rounded-full shadow-lg transform -rotate-12">
              Beta
            </div>
          </div> */}

          {/* Header */}
          <div
            className={`flex ${open ? "flex-row" : "flex-col"} w-full items-center gap-3 px-4 pt-8 text-lg font-medium text-slate-700`}
          >
            <div className="relative">
              <Image
                width={40}
                height={40}
                src={HeraldLogo}
                alt="HeraldLogo"
                className="drop-shadow-sm"
              />
            </div>

            {open && (
              <div className="flex w-full items-center justify-between">
                <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-[16px] font-semibold text-transparent">
                  Events Calendar
                </span>
                <button
                  title="Collapse Sidebar"
                  onClick={() => setOpen(false)}
                  className="group rounded-lg p-2 transition-colors duration-200 hover:bg-slate-100"
                >
                  <TbLayoutSidebarLeftCollapse className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className={cn("flex w-full flex-1 flex-col gap-2 px-4 ", open ? "mt-10" : "mt-0")}>
            {!open && (
              <button
                title="Expand Sidebar"
                onClick={() => setOpen(true)}
                className="flex h-12 w-full items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
              >
                <TbLayoutSidebarLeftExpand className="h-5 w-5" />
              </button>
            )}

            {sidebarItems.map((item, i) => (
              <Link
                href={item.navigation}
                key={i}
                className={`group relative flex h-11 w-full items-center gap-3 rounded-xl px-4 transition-all duration-200 ${
                  currentRoute === item.navigation
                    ? "bg-gradient-to-r from-[#75bf43]  to-[#75bf43] text-white shadow-lg shadow-black/15"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                onMouseEnter={() => setHovered(item.navigation)}
                onMouseLeave={() => setHovered(null)}
              >
                <span
                  className={`text-xl transition-transform duration-200 ${
                    hovered === item.navigation && currentRoute !== item.navigation
                      ? "scale-110"
                      : ""
                  }`}
                >
                  {item.icon}
                </span>

                {open && (
                  <span className="text-[15px] font-medium transition-all duration-200">
                    {item.name}
                  </span>
                )}

                {/* Active indicator */}
                {/* {currentRoute === item.navigation && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full opacity-80" />
                )} */}
              </Link>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-auto w-full space-y-4 px-4 pb-6">
            {/* Bug Report Button */}
            <div className="flex justify-center">
              <button
                onClick={() =>
                  window.open(
                    "https://docs.google.com/spreadsheets/d/16DQW5IOkN3DrfI3bVFugeRvA88uCafq7A6O4g1BCmWg/edit?usp=sharing",
                    "_blank"
                  )
                }
                className={`flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md ${
                  open ? "w-full justify-center" : "w-fit"
                }`}
              >
                <Bug size={16} />
                {open && <span className="text-sm font-medium">Report Bug</span>}
              </button>
            </div>

            {/* Semester Selector */}
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={`flex ${
                    open ? "w-full" : "w-fit"
                  } cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md`}
                >
                  {semestersLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                      {open && <span className="text-sm text-slate-500">Loading...</span>}
                    </div>
                  ) : (
                    <>
                      {open && (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-slate-700">
                            Active Semesters
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {Object.keys(ongoingSemestersGrouped).reduce(
                                (acc, val) => acc + ongoingSemestersGrouped[val].length,
                                0
                              )}{" "}
                              courses
                            </span>
                            <div className="flex items-center gap-1">
                              {ongoingSemesters?.slice(0, 3).map((semester: any, i: number) => (
                                <div
                                  key={i}
                                  className="h-3 w-3 rounded-full border-2 border-white shadow-sm"
                                  style={{ backgroundColor: semester.color }}
                                />
                              ))}
                              {ongoingSemesters?.length > 3 && (
                                <span className="ml-1 text-xs text-slate-500">
                                  +{ongoingSemesters.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <ChevronRight className="h-4 w-4 text-slate-500 transition-transform duration-200 hover:text-slate-700" />
                    </>
                  )}
                </div>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-[500px] rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
                style={{ transform: open ? "translateX(240px)" : "translateX(30px)" }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Manage Active Semesters</h3>
                  <PopoverClose className="rounded-lg p-1 transition-colors hover:bg-slate-100">
                    <RxCross2 className="h-4 w-4 text-slate-500" />
                  </PopoverClose>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {Object.keys(ongoingSemestersGrouped).map((course, i: number) => (
                    <div key={i} className="space-y-3">
                      <h4 className="border-b border-slate-200 pb-2 text-sm font-semibold text-slate-700">
                        {course}
                      </h4>
                      <div className="space-y-2">
                        {ongoingSemestersGrouped[course].map((semester: any, j: number) => (
                          <div
                            key={j}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all duration-200 ${
                              selectedActiveSemesters?.includes(semester._id)
                                ? "border border-blue-200 bg-blue-50"
                                : "bg-slate-50 hover:bg-slate-100"
                            }`}
                            onClick={() => {
                              setSelectedActiveSemesters(prev => {
                                if (prev.includes(semester._id)) {
                                  return prev.filter(id => id !== semester._id);
                                } else {
                                  return [...prev, semester._id];
                                }
                              });
                            }}
                          >
                            <div
                              className={`text-lg ${
                                selectedActiveSemesters.includes(semester._id)
                                  ? "text-blue-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {selectedActiveSemesters.includes(semester._id) ? (
                                <MdCheckBox />
                              ) : (
                                <MdCheckBoxOutlineBlank />
                              )}
                            </div>

                            <div
                              className="h-6 w-6 rounded-md shadow-sm"
                              style={{ backgroundColor: semester.color }}
                            />

                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-900">
                                {semester.semester}
                              </div>
                              <div className="text-xs text-slate-500">
                                {new Date(semester.start).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                -{" "}
                                {new Date(semester.end).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                  <button
                    onClick={() => {
                      if (selectedActiveSemesters.length === tempOngoing.length) {
                        if (profile?.activeSemester?.length === tempOngoing.length) {
                          setSelectedActiveSemesters([]);
                        } else {
                          setSelectedActiveSemesters([...(profile?.activeSemester ?? [])]);
                        }
                      } else {
                        let ongoingSemestersIds = tempOngoing.map(semester => semester?._id ?? "");
                        setSelectedActiveSemesters(ongoingSemestersIds);
                      }
                    }}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 ${
                      selectedActiveSemesters.length === tempOngoing.length
                        ? "bg-green-50 text-[#75bf43]"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="text-lg">
                      {selectedActiveSemesters.length === tempOngoing.length ? (
                        <MdCheckBox />
                      ) : (
                        <MdCheckBoxOutlineBlank />
                      )}
                    </div>
                    <span className="text-sm font-medium">Select All</span>
                  </button>

                  {!matchTwoStringArray(profile?.activeSemester ?? [], selectedActiveSemesters) && (
                    <div className="flex gap-2">
                      <PopoverClose asChild>
                        <button
                          onClick={() => {
                            setSelectedActiveSemesters([...(profile?.activeSemester ?? [])]);
                          }}
                          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
                        >
                          Cancel
                        </button>
                      </PopoverClose>

                      <button
                        onClick={() => {
                          updateProfileMutation.mutate({
                            activeSemester: selectedActiveSemesters,
                          });
                        }}
                        className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                      >
                        Save Changes
                      </button>
                    </div>
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
