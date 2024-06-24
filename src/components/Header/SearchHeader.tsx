import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { HiOutlineBell } from "react-icons/hi";
import Image from "next/image";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { IoIosSearch } from "react-icons/io";
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

export function SearchHeader({
  queryParams,
  handleQueryParams,
}: {
  queryParams: eventByParamsType;
  handleQueryParams: (value: string, action: string) => void;
}) {
  let timeout;
  const { calendarRef, selectedDate, userData } = useContext(Context);

  const date = selectedDate ? selectedDate : new Date();
  const { data: departments } = useQuery({
    queryKey: ["Departments"],
    queryFn: () => Axios.get(Endpoints.department),
  });

  return (
    <div className=" flex h-12 w-[95%] justify-between">
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
              name="q"
              value={queryParams?.q}
              onChange={(e) => handleQueryParams(e.target.value, "query")}
            />

            <Popover>
              <PopoverTrigger className="text-md text-primary-600">
                <VscSettings />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="h-[315px] w-[550px] space-y-10 p-6"
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
                          onClick={() => {
                            console.log("department.code", department.code);
                            departmentExists
                              ? handleQueryParams(
                                  department?._id,
                                  "departmentRemove",
                                )
                              : handleQueryParams(
                                  department?._id,
                                  "departmentAdd",
                                );
                          }}
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
                  <div className="flex gap-3">
                    <span
                      tabIndex={0}
                      onClick={() => {
                        // setDateType("single");
                        // setPickedDate({
                        //   startDate: pickedDate?.startDate,
                        //   endDate: pickedDate?.startDate,
                        // });
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
                  </div>

                  {dateType === "single" && (
                    <ReactDatePicker
                      className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-base text-neutral-900 outline-none focus:border-primary-600"
                      onChange={(datePicked) => {
                        // setPickedDate({
                        //   startDate: datePicked,
                        //   endDate: datePicked,
                        // })
                        // console.log("PickedDate", datePicked);
                      }}
                      value={
                        pickedDate?.startDate
                          ? format(pickedDate.startDate, "EEEE, dd MMMM", {
                              locale: US_LocaleData,
                            })
                          : undefined
                      }
                      placeholderText="Please select a date."
                      required
                    />
                  )}

                  {dateType === "multi" && (
                    <div className="flex w-full flex-row items-center gap-2 ">
                      {/* <span className="w-full border border-blue-500"> */}
                      <Datepicker
                        className="h-10 w-full flex-grow rounded border-[1px] border-neutral-300 pl-2 pr-20 text-base text-neutral-900 outline-none focus:border-primary-600"
                        onChange={(datePicked) => {
                          // setPickedDate((prev: any) => ({
                          //   ...prev,
                          //   startDate: datePicked,
                          //   // endDate: datePicked,
                          // }));
                          setPickedDate({
                            startDate: datePicked,
                            endDate: pickedDate?.endDate,
                          });
                          // console.log("PickedDate", datePicked);
                        }}
                        value={
                          pickedDate?.startDate
                            ? format(pickedDate?.startDate, "EEEE, dd MMMM", {
                                locale: US_LocaleData,
                              })
                            : undefined
                        }
                        placeholderText="Start Date."
                        required
                      />
                      <span className="text-neutral-600">-</span>
                      <ReactDatePicker
                        className="h-10 w-full flex-grow rounded border-[1px] border-neutral-300 pl-2 pr-20 text-base text-neutral-900 outline-none focus:border-primary-600"
                        onChange={(datePicked) => {
                          // setPickedDate((prev: any) => ({
                          //   ...prev,
                          //   endDate: datePicked,
                          //   // endDate: datePicked,
                          // }));
                          setPickedDate({
                            startDate: pickedDate?.startDate,
                            endDate: datePicked,
                          });
                          // console.log("PickedDate", datePicked);
                        }}
                        value={
                          pickedDate?.endDate
                            ? format(pickedDate?.endDate, "EEEE, dd MMMM", {
                                locale: US_LocaleData,
                              })
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
                          onClick={() =>
                            handleQueryParams(Color.color, "colors")
                          }
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
      <div className="flex">
        <NotificationList className="" />
        <div className="flex items-center ">
          {console.log("Profile Pic", userData?.photo) === null ? (
            <div></div>
          ) : (
            <div></div>
          )}
          <Image
            className="h-8 w-8 rounded-full"
            alt={"profile pic"}
            src={userData?.photo ?? "/images/Sidebar/HelpIcon.png"}
            width={32}
            height={32}
          />
          <p className="font-medium text-neutral-600 "></p>
        </div>
      </div>
    </div>
  );
}
