import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { HiOutlineBell } from "react-icons/hi";
import Image from "next/image";
import US_LocaleData from "date-fns/locale/en-US";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { IoIosSearch, IoMdArrowDropdown, IoMdLogOut } from "react-icons/io";
import { VscSettings } from "react-icons/vsc";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Axios } from "@/services/baseUrl";
import Endpoints from "@/services/API_ENDPOINTS";
import DepartmentButton from "../DepartmentButton";
import { access } from "fs";
import colors from "@/constants/Colors";
import ReactDatePicker from "react-datepicker";
import { NotificationList } from "../NotificationList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSettings } from "react-icons/md";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { Menu, Router } from "lucide-react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";
import ToggleSidebar from "../Sidebar/ToggleSidebar";

export function SearchHeader({
  queryParams,
  handleQueryParams,
}: {
  queryParams: eventByParamsType;
  handleQueryParams: (e: any) => void;
}) {
  let timeout;
  const [dateType, setDateType] = useState("single");
  const { calendarRef, selectedDate, userData } = useContext(Context);

  const date = selectedDate ? selectedDate : new Date();
  const { data: departments } = useQuery({
    queryKey: ["Departments"],
    queryFn: () => Axios.get(Endpoints.department),
  });

  const router = useRouter();

  const { notifications } = useContext(Context);

  let newNotifications = false;
  // console.log("notifications", notifications);
  if (notifications) {
    newNotifications = notifications.some(
      (notification: any) => !notification.isRead,
    );
  }

  return (
    <div
      className=" flex h-12
     w-[95%] items-center justify-between"
    >
      <ToggleSidebar>
        <Menu />
      </ToggleSidebar>
      <div className="flex w-9/12 justify-between">
        {/* Navigation btns and Date */}
        <label htmlFor="add-title" className="w-9/12">
          <div className="group flex h-11 w-full items-center gap-2  rounded-full border-[1px] border-primary-50 bg-neutral-100 px-4 focus-within:border-primary-600">
            <span className="text-xl">
              <IoIosSearch />
            </span>
            <input
              type="text"
              className="w-full bg-neutral-100 text-sm font-medium text-neutral-500 outline-none"
              placeholder="Search events, dates, participants..."
              id="add-title"
              name="query"
              value={queryParams?.q}
              onChange={handleQueryParams}
            />

            <Popover>
              <PopoverTrigger className="text-md text-primary-600">
                <VscSettings />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="h-auto w-[550px] space-y-10 p-6"
              >
                <h3 className="text-xl font-semibold text-neutral-900">
                  Filters
                </h3>
                <div className="flex w-full flex-col text-sm text-neutral-600">
                  <span>Department</span>
                  <div className="flex gap-1">
                    {departments?.data?.data?.map((department: Department) => {
                      const departmentExists =
                        queryParams?.departments?.includes(department?._id);
                      return (
                        <DepartmentButton
                          key={department._id}
                          id={department._id}
                          onClick={handleQueryParams}
                          value={department.code}
                          selected={queryParams?.departments?.includes(
                            department?._id,
                          )}
                        />
                      );
                    })}
                  </div>
                </div>

                <label htmlFor="date" className="flex flex-col gap-2 text-sm ">
                  <div className="flex items-center gap-3">
                    <span
                      tabIndex={0}
                      onClick={() => {
                        setDateType("single");
                      }}
                      className={`${
                        dateType === "single" ? "underline" : ""
                      } cursor-pointer  underline-offset-4`}
                    >
                      Date
                    </span>
                    <span
                      tabIndex={0}
                      onClick={() => setDateType("multi")}
                      className={`${
                        dateType === "multi" ? "underline" : ""
                      }  cursor-pointer underline-offset-4`}
                    >
                      Multi Date
                    </span>
                    <button
                      tabIndex={0}
                      name="reset"
                      onClick={handleQueryParams}
                      className={`btn btn-xs cursor-pointer bg-primary-200 underline-offset-4`}
                    >
                      Reset
                    </button>
                  </div>

                  {dateType === "single" && (
                    <ReactDatePicker
                      className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-base text-neutral-900 outline-none focus:border-primary-600"
                      name="single"
                      onChange={(date) =>
                        handleQueryParams({
                          target: { name: "single", value: date },
                        })
                      }
                      value={
                        queryParams?.eventFrom
                          ? format(
                              new Date(queryParams.eventFrom),
                              "EEEE, dd MMMM",
                              {
                                locale: US_LocaleData,
                              },
                            )
                          : undefined
                      }
                      placeholderText="Please select a date."
                      required
                    />
                  )}

                  {dateType === "multi" && (
                    <div className="flex w-full flex-row items-center gap-2 ">
                      <ReactDatePicker
                        className="h-10 w-full flex-grow rounded border-[1px] border-neutral-300 pl-2 pr-20 text-base text-neutral-900 outline-none focus:border-primary-600"
                        onChange={(date) =>
                          handleQueryParams({
                            target: { name: "multiStart", value: date },
                          })
                        }
                        value={
                          queryParams?.eventFrom
                            ? format(
                                new Date(queryParams.eventFrom),
                                "EEEE, dd MMMM",
                                {
                                  locale: US_LocaleData,
                                },
                              )
                            : undefined
                        }
                        placeholderText="Start Date."
                        required
                      />
                      <span className="text-neutral-600">-</span>
                      <ReactDatePicker
                        className="h-10 w-full flex-grow rounded border-[1px] border-neutral-300 pl-2 pr-20 text-base text-neutral-900 outline-none focus:border-primary-600"
                        onChange={(date) =>
                          handleQueryParams({
                            target: { name: "multiEnd", value: date },
                          })
                        }
                        value={
                          queryParams?.eventTo
                            ? format(
                                new Date(queryParams.eventTo),
                                "EEEE, dd MMMM",
                                {
                                  locale: US_LocaleData,
                                },
                              )
                            : undefined
                        }
                        placeholderText="End Date."
                        required
                      />
                    </div>
                  )}
                </label>
                <div className=" text-sm text-neutral-600">
                  <span>Choose Priorities</span>
                  <div className="flex gap-2">
                    {colors?.map((Color, i) => (
                      <label
                        className={`btn checkbox btn-xs relative h-7 w-7 cursor-pointer rounded-none border-none`}
                        style={{ backgroundColor: Color.color }}
                        htmlFor={`ColorInput${i}`}
                        key={i}
                      >
                        <input
                          type="checkbox"
                          id={`ColorInput${i}`}
                          className={
                            queryParams.colors.includes(Color.color)
                              ? "absolute h-full w-full border-none text-white"
                              : "absolute hidden h-full w-full border-none text-white"
                          }
                          style={{
                            accentColor: Color.color,
                          }}
                          name="colors"
                          value={Color.color}
                          onClick={handleQueryParams}
                          checked={queryParams.colors.includes(Color.color)}
                          // readOnly
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </label>
      </div>

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
