"use client";
import Datepicker from "react-datepicker";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, set } from "date-fns";

import { BiPencil } from "react-icons/bi";
import "react-datepicker/dist/react-datepicker.css";
import US_LocaleData from "date-fns/locale/en-US";
import { AiOutlinePlus } from "react-icons/ai";
import ContextProvider, { Context } from "@/app/clientWrappers/ContextProvider";
import { Axios, baseUrl } from "@/services/baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  postEvents,
  useEditEventMutation,
  usePostEventMutation,
} from "@/services/api/eventsApi";
import { watch } from "fs";
import { getDepartments, useGetDepartments } from "@/services/api/departments";
import colors from "@/constants/Colors";
import { Textarea } from "../ui/textarea";
import { RecurringEventTypes } from "@/constants/RecurringEvents";
import InviteMembers from "./InviteMembers";
import "./AddEventModal.css";
import CustomTimePicker from "./CustomTimePicker";
import { makePascalCase } from "@/lib/utils";
import DepartmentButton from "../DepartmentButton";
import Locations from "./Locations";
import DatePicker from "./DatePicker";

export default function EditEventModal1({
  defaultData,
}: {
  defaultData: eventType | null;
}) {
  const [dateType, setDateType] = useState<"single" | "multi">("single");
  const [defaultValuesArr, setDefaultValuesArr] = useState<any[]>([]);
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
    recurringType: RecurringEventTypes.ONCE,
    involvedUsers: [],
    recurrenceEnd: null,
    notifyUpdate: false,
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const eventFormRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const { userData } = useContext(Context);
  const { data: departmentsRes } = useGetDepartments();
  const { mutate: postNewEvent } = usePostEventMutation({ setNewEvent });

  useEffect(() => {
    if (!eventFormRef.current) return;
    eventFormRef.current
      .querySelector(".form-validation-msg")
      // @ts-ignore
      ?.previousSibling?.scrollIntoView();
  }, [formErrors?.name]);

  function handleCreateEvent() {
    if (!validateAndFocus()) return;

    postNewEvent(newEvent, {
      onSuccess: (res) => {
        console.log("Onsuccess", res);
        queryClient.invalidateQueries({ queryKey: ["Events"] });

        toast.success(`${res?.data?.message}`);

        setNewEvent &&
          setNewEvent({
            title: "",
            start: null,
            end: null,
            color: undefined,
            duration: 0,
            recurringType: RecurringEventTypes.ONCE,
            location: "",
            description: "",
            departments: [],
            notes: "",
            involvedUsers: [],
            recurrenceEnd: null,
            notifyUpdate: false,
          });
      },
      onError: (err: any) => {
        console.log("error", err);
        toast.error(err?.response?.data?.message || "something went wrong");
      },
    });
  }

  const handleValueChange = (e: any) => {
    let { name, value } = e.target;
    if (!name) {
      name = e.currentTarget.name;
      value = e.currentTarget.value;
    }

    // console.log("name value", name, value);
    console.log("default", name, value);

    switch (name) {
      case "department":
        if (newEvent.departments.includes(value)) {
          setNewEvent((prev) => ({
            ...prev,
            departments: [
              ...newEvent.departments.filter((item) => item !== value),
            ],
          }));
        } else {
          setNewEvent((prev) => ({
            ...prev,
            departments: [...newEvent.departments, value],
          }));
        }
        break;

      case "addMember": {
        const userId = value;
        if (newEvent?.involvedUsers.includes(userId)) return;
        setNewEvent({
          ...newEvent,
          involvedUsers: [...newEvent?.involvedUsers, userId],
        });
        break;
      }
      case "removeMember": {
        const userId = value;

        setNewEvent((prev) => ({
          ...prev,
          involvedUsers: [
            ...newEvent?.involvedUsers.filter(
              (memberId) => memberId !== userId,
            ),
          ],
        }));
        break;
      }

      default:
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    }
  };

  console.log("neweent", newEvent);
  const validateAndFocus = () => {
    console.log("departments", newEvent?.departments);
    if (!eventFormRef.current) return;

    if (!newEvent?.title) {
      setFormErrors({ name: "title", message: "Title is a required field." });
      return false;
    }
    if (!newEvent?.description) {
      setFormErrors({
        name: "description",
        message: "Description is a required field.",
      });
      return false;
    }
    if (!newEvent?.start) {
      setFormErrors({ name: "start", message: "Select a start date." });
      return false;
    }
    if (!newEvent?.end) {
      setFormErrors({ name: "end", message: "Select a end date." });
      return false;
    }

    if (newEvent?.start > newEvent?.end) {
      setFormErrors({
        name: "end",
        message: "End date should be after start date.",
      });
      return false;
    }

    if (!newEvent?.departments || newEvent?.departments?.length === 0) {
      setFormErrors({ name: "department", message: "Select a department." });
      return false;
    }
    setFormErrors({});
    return true;
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <button
          className="scale btn btn-sm
           relative  hidden h-8 w-32 rounded border-none bg-primary-600 px-3 py-2 text-xs font-semibold text-primary-50 outline-none hover:bg-primary-400"
          onClick={() => {
            const modal_4 = document.getElementById(
              "my_modal_5",
            ) as HTMLDialogElement;
            modal_4.showModal();
          }}
          key={"my_modal_5"}
        >
          <AiOutlinePlus className="h-4 w-4 font-bold text-primary-50" />
          Add Event
        </button>
        <dialog id="my_modal_5" className="modal z-[1111]">
          <div
            ref={eventFormRef}
            className="min-w-xl modal-box relative flex max-w-2xl flex-col gap-10 overflow-y-auto p-8 text-lg text-neutral-600"
          >
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
            <div className="flex flex-col gap-8 font-normal ">
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
                    name="title"
                    value={newEvent?.title}
                    onChange={handleValueChange}
                  />
                </div>
                {formErrors?.name === "title" && (
                  <span className="form-validation-msg text-sm text-danger-700">
                    {formErrors?.message}
                  </span>
                )}
              </label>
              {/* Description section  */}
              <div className="flex w-full flex-col items-start text-sm">
                Description <br />
                <Textarea
                  placeholder="Type your message here."
                  className="w-full font-normal text-neutral-900 ring-ring focus:border-primary-600  focus-visible:ring-0"
                  id="message"
                  name="description"
                  onChange={handleValueChange}
                  value={newEvent?.description ? newEvent?.description : ""}
                />
                {formErrors?.name === "description" && (
                  <span className="form-validation-msg text-sm text-danger-700">
                    {formErrors?.message}
                  </span>
                )}
              </div>
              {/* Date Input section */}
              <label htmlFor="date" className="flex flex-col gap-2 text-sm ">
                <div className="flex gap-3">
                  <button
                    tabIndex={0}
                    name="end"
                    onClick={(e) => {
                      setDateType("single");
                      handleValueChange({
                        target: { name: "end", value: newEvent?.start },
                      });
                    }}
                    className={`${
                      dateType === "single" ? "underline" : ""
                    } cursor-pointer  underline-offset-4`}
                  >
                    Date
                  </button>
                  <button
                    tabIndex={0}
                    onClick={() => setDateType("multi")}
                    className={`${
                      dateType === "multi" ? "underline" : ""
                    }  cursor-pointer underline-offset-4`}
                  >
                    Multi Date
                  </button>
                </div>

                {dateType === "single" ? (
                  <DatePicker
                    value={newEvent?.start}
                    handleValueChange={({ target: { name, value } }) => {
                      // handleValueChange({ target: { name: "start", value } });
                      // handleValueChange({ target: { name: "end", value } });
                      let newStart;
                      let newEnd;

                      if (newEvent?.start) {
                        let oldHours = new Date(newEvent?.start).getHours();
                        let oldMinutes = new Date(newEvent?.start).getMinutes();
                        newStart = new Date(
                          new Date(value).setHours(oldHours, oldMinutes),
                        );

                        console.log(
                          "START::::::::::::::::::Old Hours:",
                          oldHours,
                        );
                        console.log(
                          "START::::::::::::::::::Old Minutes:",
                          oldMinutes,
                        );
                        console.log(
                          "START::::::::::::::::::newStart:",
                          newStart,
                        );
                      } else {
                        newStart = new Date(value);
                      }

                      if (newEvent?.end) {
                        let oldHours = new Date(newEvent?.end).getHours();
                        let oldMinutes = new Date(newEvent?.end).getMinutes();
                        newEnd = new Date(
                          new Date(value).setHours(oldHours, oldMinutes),
                        );

                        console.log("END:::::::::::::::::Old Hours:", oldHours);
                        console.log(
                          "END:::::::::::::::::Old Minutes:",
                          oldMinutes,
                        );
                        console.log("END:::::::::::::::::newEnd:", newEnd);
                      } else {
                        newEnd = new Date(
                          new Date(value).setHours(
                            new Date(value).getHours() + 1,
                          ),
                        );
                      }

                      handleValueChange({
                        target: { name: "start", value: newStart },
                      });
                      handleValueChange({
                        target: { name: "end", value: newEnd },
                      });
                    }}
                    name={"start"}
                  />
                ) : (
                  <div className="flex w-full flex-row items-center gap-2 ">
                    <DatePicker
                      value={newEvent?.start}
                      handleValueChange={handleValueChange}
                      name={"start"}
                    />
                    <span className="text-neutral-600">-</span>
                    <DatePicker
                      value={newEvent?.end}
                      handleValueChange={handleValueChange}
                      name={"end"}
                    />
                  </div>
                )}
                {(formErrors?.name === "start" ||
                  formErrors?.name === "end") && (
                  <span className="form-validation-msg text-sm text-danger-700">
                    {formErrors?.message}
                  </span>
                )}
                {/* Recurrence  */}
                <div className="flex gap-[14px]">
                  {(
                    Object.keys(RecurringEventTypes) as Array<
                      keyof typeof RecurringEventTypes
                    >
                  ).map((eventKey, i) => {
                    return (
                      <label
                        className="flex cursor-pointer items-center gap-[7px] text-sm font-medium text-neutral-500"
                        htmlFor={eventKey}
                        key={i}
                      >
                        <input
                          checked={
                            RecurringEventTypes[eventKey] ===
                            newEvent?.recurringType
                          }
                          id={eventKey}
                          type="checkbox"
                          name={"recurringType"}
                          value={RecurringEventTypes[eventKey]}
                          onClick={handleValueChange}
                        />
                        <span>{makePascalCase(eventKey)}</span>
                      </label>
                    );
                  })}
                </div>
              </label>
              {/* Time Picker  */}
              <div className="flex w-full gap-4">
                <CustomTimePicker
                  type="start"
                  value={newEvent?.start}
                  handleTimeChange={handleValueChange}
                />
                <CustomTimePicker
                  type="end"
                  value={newEvent?.end}
                  handleTimeChange={handleValueChange}
                />
              </div>
              {/* Color input section  */}
              <div className="flex flex-col items-start">
                <span className="text-sm">Priority</span>
                <div key={"AddEventPriority"} className="flex gap-2">
                  {colors?.map((Color, i) => (
                    // <label
                    //   className={`fc-custom-semester-dot-event btn checkbox btn-xs relative h-7 w-7 cursor-pointer rounded-none border-none`}
                    //   style={{ backgroundColor: Color.color }}
                    //   htmlFor={`ColorInput${i}`}
                    //   key={i}
                    // >
                    //   <input
                    //     type="checkbox"
                    //     className={
                    //       Color.color == newEvent?.color
                    //         ? "absolute h-full w-full border-none text-white"
                    //         : "absolute hidden h-full w-full border-none text-white"
                    //     }
                    //     style={{
                    //       accentColor: Color.color,
                    //     }}
                    //     checked={Color.color == newEvent?.color}
                    //     readOnly
                    //   />
                    //   <input
                    //     name="color"
                    //     id={`ColorInput${i}`}
                    //     type="radio"
                    //     className="absolute hidden"
                    //     value={Color.color}
                    //     onChange={handleValueChange}
                    //   />
                    //   <div className="semester-tooltip-wrapper-event">
                    //     <div
                    //       className="semester-tooltip-data"
                    //       style={{
                    //         color: Color.color,
                    //       }}
                    //     >
                    //       {Color.priority}
                    //     </div>
                    //   </div>
                    // </label>
                    <>
                      <button
                        className="flex h-7 w-7 items-center justify-center text-xl text-white"
                        style={{ backgroundColor: Color.color }}
                        name="color"
                        onClick={handleValueChange}
                        value={Color.color}
                      >
                        {Color.color === newEvent?.color && (
                          <FaCheck className="text-white" />
                        )}
                      </button>
                    </>
                  ))}
                </div>
                {/* {formErrors?.name === "color" && (
                  <span className="form-validation-msg text-sm text-danger-700">
                    {formErrors?.message}
                  </span>
                )} */}
              </div>
              {/* Location section  */}
              <Locations
                value={newEvent?.location ?? ""}
                handleValueChange={handleValueChange}
              />{" "}
              {formErrors?.name === "location" && (
                <span className="form-validation-msg text-sm text-danger-700">
                  {formErrors?.message}
                </span>
              )}
              {/* Departments section  */}
              <div className="flex flex-col items-start text-sm">
                <span>Departments:</span>
                <div className="my-2 flex flex-wrap items-center gap-1">
                  {Array.isArray(departmentsRes) &&
                    departmentsRes?.map((department: Department) => {
                      const departmentExists =
                        newEvent?.departments.includes(department.code) ||
                        department.code === userData?.department?.code;
                      return (
                        <DepartmentButton
                          key={department._id}
                          id={department._id}
                          onClick={() =>
                            handleValueChange({
                              target: {
                                name: "department",
                                value: department.code,
                              },
                            })
                          }
                          value={department.code}
                          selected={departmentExists}
                        />
                      );
                    })}
                </div>
                {formErrors?.name === "department" && (
                  <span className="form-validation-msg text-sm text-danger-700">
                    {formErrors?.message}
                  </span>
                )}
              </div>
              <InviteMembers
                memberIds={newEvent?.involvedUsers}
                handleInviteMembers={handleValueChange}
              ></InviteMembers>
              {/* Notes section  */}
              <div className=" flex flex-col items-start text-sm">
                <span className="">Notes</span>
                <input
                  type="text"
                  className="h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-neutral-900 focus:border-primary-600"
                  name="notes"
                  value={newEvent?.notes}
                  onChange={handleValueChange}
                />
              </div>
              {/* <div className="flex items-center gap-2"> */}
              <label
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-neutral-500"
                htmlFor={"notify"}
              >
                <input
                  checked={newEvent?.notifyUpdate || false}
                  id={"notify"}
                  type="checkbox"
                  name={"notifyUpdate"}
                  onChange={(e) =>
                    handleValueChange({
                      target: { name: e.target.name, value: e.target.checked },
                    })
                  }
                />
                Notify
              </label>
              {/* </div> */}
            </div>

            {/* create btn  */}
            <div
              // method="dialog"
              className=" flex h-16 w-full items-center justify-end "
            >
              <button
                className="btn btn-md  h-5 border-none bg-primary-600 text-base font-medium text-primary-50"
                onClick={handleCreateEvent}
              >
                Create
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </LocalizationProvider>
    </>
  );
}
