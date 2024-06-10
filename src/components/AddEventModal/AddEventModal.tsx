"use client";
import Datepicker from "react-datepicker";
import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Calendar } from "@/components/ui/calendar";
import { HiOutlineCalendar } from "react-icons/hi";

import { BiPencil } from "react-icons/bi";
import "react-datepicker/dist/react-datepicker.css";
import { TimeSelector } from "./TimeSelector";
import { MdOutlineHourglassTop } from "react-icons/md";
import { LiaHourglassEndSolid, LiaHourglassStartSolid } from "react-icons/lia";
import format from "date-fns/format";
import US_LocaleData from "date-fns/locale/en-US";
import { DateRange } from "react-big-calendar";
import { AiOutlinePlus } from "react-icons/ai";
import { Context } from "@/app/clientWrappers/ContextProvider";
import "./AddEventModal.css";
import { Axios, baseUrl } from "@/services/baseUrl";
import * as CookieHooks from "@/hooks/CookieHooks";
import { useGetCookieByName } from "@/hooks/CookieHooks";
import { DEPARTMENTS } from "@/constants/departments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { postEvents } from "@/services/api/eventsApi";
import { watch } from "fs";
import DepartmentBtn from "./DepartmentBtn";
import { getDepartments } from "@/services/api/departments";
import colors from "@/constants/Colors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { setPriority } from "os";

interface PickedDateType {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export default function AddEventModal() {
  const [pickedDate, setPickedDate] = useState<any>();
  const [dateType, setDateType] = useState<"single" | "multi">("single");

  const queryClient = useQueryClient();

  const token = useGetCookieByName("token");

  const [newEvent, setNewEvent] = useState<eventType>({
    title: "",
    start: null,
    end: null,
    color: undefined,
    duration: 0,
    location: "",
    description: undefined,
    departments: [],
    notes: "",
  });

  const { data: departmentsRes } = useQuery({
    queryKey: ["Departments"],
    queryFn: getDepartments,
  });

  console.log("depar", departmentsRes);
  const { mutate: postNewEvent } = useMutation({
    mutationFn: postEvents,
    onSuccess: (res) => {
      console.log("Onsuccess", res);
      queryClient.invalidateQueries({ queryKey: ["Events"] });
      toast.success(`${res?.data?.success}`);
      setNewEvent({
        title: "",
        start: null,
        end: null,
        color: undefined,
        duration: 0,
        location: "",
        description: undefined,
        departments: [],
        notes: "",
      });
    },
    onError: (err) => {
      console.log("error", error);
      toast.error(err?.data.message || "something went wrong");
    },
  });

  function handleAddEvent() {
    console.log("handle add event ", newEvent);
    // setEvents([...events, newEvent]);
    postNewEvent(newEvent);
  }

  const setDateAndTime = ({ hours, minutes, type }: setDateAndTimeTypes) => {
    if (pickedDate?.startDate && pickedDate.endDate) {
      console.log("selected date in setdateandtime function:", pickedDate);
      // const date = format(pickedDate.startDate, "yyyy-MM-dd", {
      //   locale: US_LocaleData,
      // });

      if (type === "start") {
        const startDate = format(pickedDate.startDate, "yyyy-MM-dd", {
          locale: US_LocaleData,
        });
        const finalStartDate = new Date(startDate);
        finalStartDate?.setHours(hours);
        finalStartDate?.setMinutes(minutes);

        setNewEvent({ ...newEvent, start: finalStartDate });
      } else if (type === "end") {
        const endDate = format(pickedDate.endDate, "yyyy-MM-dd", {
          locale: US_LocaleData,
        });
        const finalEndDate = new Date(endDate);
        finalEndDate?.setHours(hours);
        finalEndDate?.setMinutes(minutes);

        setNewEvent({ ...newEvent, end: finalEndDate });
      }
    }
  };
  console.log("render", newEvent);
  return (
    <>
      <button
        className="scale btn btn-sm
           relative flex h-8 w-32 rounded border-none bg-primary-600 px-3 py-2 text-xs font-semibold text-primary-50 outline-none hover:bg-primary-400"
        onClick={() => {
          const modal_3 = document.getElementById(
            "my_modal_3",
          ) as HTMLDialogElement;
          modal_3.showModal();
        }}
      >
        <AiOutlinePlus className="h-4 w-4 font-bold text-primary-50" />
        Add Event
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="min-w-xl modal-box relative flex max-w-2xl flex-col gap-10 overflow-y-auto  p-8 text-lg text-neutral-600">
          {/* Heading  */}
          <div className="m-auto">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-bold">Add Event</h3>
          </div>

          {/* input section  */}
          <div className="flex flex-col gap-8">
            {/* Title input section  */}
            <label htmlFor="add-title">
              <div className="group flex h-11 w-full items-center gap-2  border-b-[1px] border-neutral-300 px-4 focus-within:border-primary-600">
                <span className="text-xl">
                  <BiPencil />
                </span>
                <input
                  type="text"
                  className="w-full text-lg font-normal text-neutral-900 outline-none"
                  placeholder="Add Title"
                  id="add-title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
            </label>
            {/* Description section  */}
            <div className="w-full text-sm">
              Description <br />
              <textarea
                className="textarea textarea-bordered w-full text-neutral-900 focus:border-primary-600 focus:outline-none"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              ></textarea>
            </div>

            {/* Date Input section */}
            <label htmlFor="date" className="flex flex-col gap-2 text-sm ">
              <div className="flex gap-3">
                <span
                  tabIndex={0}
                  onClick={() => {
                    setDateType("single");
                    setPickedDate({
                      startDate: pickedDate.startDate,
                      endDate: pickedDate.startDate,
                    });
                  }}
                  className={`${
                    dateType === "single" ? "underline" : ""
                  } cursor-pointer `}
                >
                  Date
                </span>
                <span
                  tabIndex={0}
                  onClick={() => setDateType("multi")}
                  className={`${
                    dateType === "multi" ? "underline" : ""
                  }  cursor-pointer`}
                >
                  Multi Date
                </span>
              </div>

              {dateType === "single" && (
                <Datepicker
                  className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-base text-neutral-900 outline-none focus:border-primary-600"
                  onChange={(datePicked) => {
                    setPickedDate({
                      startDate: datePicked,
                      endDate: datePicked,
                    });
                    // console.log("PickedDate", datePicked);
                  }}
                  value={
                    pickedDate
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
                        endDate: pickedDate.endDate,
                      });
                      // console.log("PickedDate", datePicked);
                    }}
                    value={
                      pickedDate?.startDate
                        ? format(pickedDate.startDate, "EEEE, dd MMMM", {
                            locale: US_LocaleData,
                          })
                        : undefined
                    }
                    placeholderText="Start Date."
                    required
                  />
                  <span className="text-neutral-600">-</span>
                  <Datepicker
                    className="h-10 w-full flex-grow rounded border-[1px] border-neutral-300 pl-2 pr-20 text-base text-neutral-900 outline-none focus:border-primary-600"
                    onChange={(datePicked) => {
                      // setPickedDate((prev: any) => ({
                      //   ...prev,
                      //   endDate: datePicked,
                      //   // endDate: datePicked,
                      // }));
                      setPickedDate({
                        startDate: pickedDate.startDate,
                        endDate: datePicked,
                      });
                      // console.log("PickedDate", datePicked);
                    }}
                    value={
                      pickedDate?.endDate
                        ? format(pickedDate.endDate, "EEEE, dd MMMM", {
                            locale: US_LocaleData,
                          })
                        : undefined
                    }
                    placeholderText="End Date."
                    required
                  />
                  {/* </span> */}
                  {/* <Datepicker
                    className="h-10 w-full flex-1 rounded border-[1px] border-neutral-300 px-2 text-base text-neutral-900 outline-none focus:border-primary-600"
                    onChange={(datePicked) => {
                      setPickedDate((prev: any) => ({
                        ...prev,
                        // startDate: datePicked,
                        endDate: datePicked,
                      }));
                      // console.log("PickedDate", datePicked);
                    }}
                    value={
                      pickedDate?.endDate
                        ? format(pickedDate.endDate, "EEEE, dd MMMM", {
                            locale: US_LocaleData,
                          })
                        : undefined
                    }
                    placeholderText="Please select a date."
                    required
                  /> */}
                </div>
              )}
            </label>

            {/* Time input section */}
            <div className="flex flex-col">
              <div className="flex gap-4">
                <div className="flex w-full  flex-col ">
                  <span className="text-sm">From</span>
                  <div className="flex h-10 items-center rounded border border-neutral-300 px-3 py-2 focus:border-primary-600">
                    <span className="text-3xl">
                      <LiaHourglassStartSolid />
                    </span>
                    <TimeSelector
                      setDateAndTime={setDateAndTime}
                      type="start"
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col">
                  <span className="text-sm">To</span>
                  <div className="group flex h-10 items-center rounded border border-neutral-300 px-3 py-2 focus:border-primary-600">
                    <span className="text-3xl">
                      <LiaHourglassEndSolid />
                    </span>
                    <TimeSelector setDateAndTime={setDateAndTime} type="end" />
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-neutral-500">
                Duration:
              </span>
            </div>

            {/* Color input section  */}
            <div>
              <span className="text-sm">Priority</span>
              <div className="flex gap-2">
                {colors.map((Color, i) => (
                  <label
                    className={`btn checkbox btn-xs relative h-7 w-7 cursor-pointer rounded-none border-none`}
                    style={{ backgroundColor: Color.color }}
                    htmlFor={`ColorInput${i}`}
                    key={i}
                  >
                    <input
                      type="checkbox"
                      className={
                        Color.color == newEvent.color
                          ? "absolute h-full w-full border-none text-white"
                          : "absolute hidden h-full w-full border-none text-white"
                      }
                      style={{
                        accentColor: Color.color,
                      }}
                      checked={Color.color == newEvent.color}
                      readOnly
                    />
                    <input
                      name={"color"}
                      id={`ColorInput${i}`}
                      type="radio"
                      className="absolute hidden"
                      onChange={() => {
                        setNewEvent({ ...newEvent, color: Color.color });
                        console.log(
                          `index ${i} clicked, Color.color: ${Color.color}`,
                        );
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Location section  */}
            <div>
              <span className="text-sm">
                Location <br />
              </span>
              <input
                type="text"
                className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </div>

            {/* Departments section  */}
            <div className="text-sm">
              <span>Departments:</span>
              <div className="my-2 flex flex-wrap items-center gap-1">
                {departmentsRes?.data?.data?.map(
                  (department: any, i: number) => (
                    <DepartmentBtn
                      key={i}
                      setNewEvent={setNewEvent}
                      index={i}
                      department={department}
                    />
                  ),
                )}
              </div>
            </div>

            {/* Notes section  */}
            <div className="">
              <span>Notes</span> <br />
              <input
                type="text"
                className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
                value={newEvent.notes}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, notes: e.target.value })
                }
              />
            </div>
          </div>

          {/* create btn  */}
          <form
            method="dialog"
            className=" flex h-16 w-full items-center justify-end "
          >
            <button
              className="btn btn-md  h-5 border-none bg-primary-600 text-base font-medium text-primary-50"
              onClick={handleAddEvent}
            >
              Create
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
