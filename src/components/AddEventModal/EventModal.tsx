"use client";
import Datepicker from "react-datepicker";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";

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
import { postEvents, usePostEventMutation } from "@/services/api/eventsApi";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Endpoints from "@/services/API_ENDPOINTS";
import Locations from "./Locations";
import DatePicker from "./DatePicker";
import "./EventModal.css";

interface PickedDateType {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

// NEW ADD EVENT MODAL FINAL ------------------------------

export default function EventModal({
  defaultData,
  type,
}: {
  defaultData: eventType | null;
  type: "Edit" | "Add";
}) {
  const [dateType, setDateType] = useState<"single" | "multi">("single");

  const [formErrors, setFormErrors] = useState<any>({});

  const [newEvent, setNewEvent] = useState<eventType>({
    title: "",
    start: new Date(),
    end: null,
    color: colors.find((color) => color?.priority === "Informational")?.color,
    duration: 0,
    location: "",
    description: undefined,
    departments: [],
    notes: "",
    recurringType: RecurringEventTypes.ONCE,
    involvedUsers: [],
    recurrenceEnd: null,
  });
  const eventFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("defaultData in useEffect", defaultData);
    if (!defaultData) return;
    const modifiedData = {
      ...defaultData,
      departments: defaultData.departments.map(
        //@ts-ignore
        (department) => department?.code,
      ),
      start: defaultData.start ? new Date(defaultData.start) : new Date(),
      end: defaultData.end ? new Date(defaultData.end) : new Date(),
    };
    setNewEvent(modifiedData);
    console.log("modifiedData", modifiedData);
  }, [defaultData]);

  const { userData } = useContext(Context);

  const { data: departmentsRes } = useGetDepartments();
  const { mutate: postNewEvent } = usePostEventMutation({ setNewEvent });

  const queryClient = useQueryClient();
  function handleAddEvent() {
    if (!validateAndFocus()) return;
    postNewEvent(newEvent, {
      onSuccess: () => {
        const modal_3 = document.getElementById(
          "my_modal_3",
        ) as HTMLDialogElement;
        modal_3.close();
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

  useEffect(() => {
    // @ts-ignore
    eventFormRef.current
      .querySelector(".form-validation-msg")
      // @ts-ignore
      ?.previousSibling?.scrollIntoView();
  }, [formErrors?.name]);

  useEffect(() => {
    if (userData?.department) {
      let currentDepartments = [userData?.department?._id].concat(
        newEvent?.departments ?? [],
      );
      currentDepartments = Array.from(new Set(currentDepartments));
      setNewEvent((prev) => ({ ...prev, departments: currentDepartments }));
    }
  }, [userData]);

  const validateAndFocus = () => {
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

    if (newEvent?.start >= newEvent?.end) {
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
          className=" btn btn-sm
           relative flex h-8 w-32 rounded border-none bg-primary-600 px-3 py-2 text-xs font-semibold text-primary-50 outline-none hover:bg-primary-400"
          onClick={() => {
            const modal_3 = document.getElementById(
              "my_modal_3",
            ) as HTMLDialogElement;
            modal_3.showModal();
          }}
          key={"my_modal_3"}
        >
          <AiOutlinePlus className="h-4 w-4 font-bold text-primary-50" />
          {type} Event
        </button>
        <dialog id="my_modal_3" className="modal z-[1111]">
          <div
            ref={eventFormRef}
            className="min-w-xl hide-scrollbar modal-box relative flex max-w-2xl flex-col gap-10 overflow-y-auto p-8 text-lg text-neutral-600"
          >
            {/* Heading  */}
            <div className="m-auto">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="text-lg font-bold">{type} Event</h3>
            </div>

            {/* input section  */}
            <div className="relative flex flex-col gap-8">
              {/* Title input section  */}
              <label htmlFor="add-title">
                <div className="group flex h-11 w-full items-center gap-2  border-b-[1px] border-neutral-300 px-4 focus-within:border-primary-600">
                  <span className="text-xl">
                    <BiPencil />
                  </span>
                  <input
                    type="text"
                    className="w-full text-lg font-normal text-neutral-900 outline-none"
                    placeholder={`${type} Title`}
                    id="add-title"
                    name="title"
                    value={newEvent.title}
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
              <div className="w-full text-sm">
                Description <br />
                <Textarea
                  placeholder="Type your message here."
                  className="w-full text-neutral-900 ring-ring focus:border-primary-600  focus-visible:ring-0"
                  id="message"
                  name="description"
                  onChange={handleValueChange}
                  value={newEvent?.description ? newEvent.description : ""}
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
                        target: { name: "end", value: newEvent.start },
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
                    value={newEvent.start}
                    handleValueChange={({ target: { name, value } }) => {
                      let newStart;
                      let newEnd;

                      if (newEvent.start) {
                        let oldHours = new Date(newEvent.start).getHours();
                        let oldMinutes = new Date(newEvent.start).getMinutes();
                        newStart = new Date(
                          new Date(value).setHours(oldHours, oldMinutes),
                        );
                      } else {
                        newStart = new Date(value);
                      }

                      if (newEvent.end) {
                        let oldHours = new Date(newEvent.end).getHours();
                        let oldMinutes = new Date(newEvent.end).getMinutes();
                        newEnd = new Date(
                          new Date(value).setHours(oldHours, oldMinutes),
                        );
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
                      value={newEvent.start}
                      handleValueChange={({ target: { name, value } }) => {
                        let newStart;

                        if (newEvent.start) {
                          let oldHours = new Date(newEvent.start).getHours();
                          let oldMinutes = new Date(
                            newEvent.start,
                          ).getMinutes();
                          newStart = new Date(
                            new Date(value).setHours(oldHours, oldMinutes),
                          );
                        } else {
                          newStart = new Date(
                            new Date(value).setHours(
                              new Date(value).getHours() + 1,
                            ),
                          );
                        }

                        handleValueChange({
                          target: { name: "start", value: newStart },
                        });
                      }}
                      name={"start"}
                    />
                    <span className="text-neutral-600">-</span>
                    <DatePicker
                      value={newEvent.end}
                      name={"end"}
                      handleValueChange={({ target: { name, value } }) => {
                        let newEnd;

                        if (newEvent.end) {
                          let oldHours = new Date(newEvent.end).getHours();
                          let oldMinutes = new Date(newEvent.end).getMinutes();
                          newEnd = new Date(
                            new Date(value).setHours(oldHours, oldMinutes),
                          );
                        } else {
                          newEnd = new Date(value);
                        }

                        handleValueChange({
                          target: { name: "end", value: newEnd },
                        });
                      }}
                    />
                  </div>
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
                            newEvent.recurringType
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
                  value={newEvent.start}
                  handleTimeChange={handleValueChange}
                />
                <CustomTimePicker
                  type="end"
                  value={newEvent.end}
                  handleTimeChange={handleValueChange}
                />
              </div>

              {(formErrors?.name === "start" || formErrors?.name === "end") && (
                <span className="form-validation-msg text-sm text-danger-700">
                  {formErrors?.message}
                </span>
              )}

              {/* Recurrence End */}
              {newEvent.recurringType !== "NONE" && (
                <div className="w-full text-sm">
                  <span>Recurrence End Date:</span>
                  <DatePicker
                    name={"recurrenceEnd"}
                    value={newEvent.recurrenceEnd}
                    handleValueChange={handleValueChange}
                  />
                </div>
              )}

              {/* Color input section  */}
              <div className=" flex flex-col items-start">
                <span className="text-sm">Priority</span>
                <div key={"AddEventPriority"} className="flex gap-2">
                  {colors?.map((Color, i) => (
                    <label
                      className={`fc-custom-semester-dot-event btn checkbox btn-xs relative h-7 w-7 cursor-pointer rounded-none border-none`}
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
                        name="color"
                        id={`ColorInput${i}`}
                        type="radio"
                        className="absolute hidden"
                        value={Color.color}
                        onChange={handleValueChange}
                      />
                      <div className="semester-tooltip-wrapper-event">
                        <div
                          className="semester-tooltip-data"
                          style={{
                            color: Color.color,
                          }}
                        >
                          {Color.priority}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {formErrors?.name === "color" && (
                  <span className="form-validation-msg text-sm text-danger-700">
                    {formErrors?.message}
                  </span>
                )}
              </div>

              {/* Location section  */}
              <Locations
                value={newEvent?.location ? newEvent.location : ""}
                handleValueChange={handleValueChange}
              ></Locations>
              {formErrors?.name === "location" && (
                <span className="form-validation-msg text-sm text-danger-700">
                  {formErrors?.message}
                </span>
              )}

              {/* Departments section  */}
              <div className="text-sm">
                <span>Departments:</span>
                <div className="my-2 flex flex-wrap items-center gap-1">
                  {Array.isArray(departmentsRes) &&
                    departmentsRes?.map((department: Department) => {
                      const departmentExists = newEvent.departments.includes(
                        department._id,
                      );
                      return (
                        <DepartmentButton
                          key={department._id}
                          id={department._id}
                          onClick={handleValueChange}
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
              <div className="text-sm">
                <span>Notes</span> <br />
                <input
                  type="text"
                  className=" h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-sm text-neutral-900 focus:border-primary-600"
                  name="notes"
                  value={newEvent.notes}
                  onChange={handleValueChange}
                />
              </div>
            </div>

            {/* create btn  */}
            <div className="flex w-full items-center justify-end gap-5">
              <button
                className="rounded-md border-none bg-primary-600 px-4 py-2 text-base font-medium text-primary-50 hover:bg-primary-700"
                onClick={handleAddEvent}
              >
                {type === "Add" ? "Create" : "Edit"}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>Close</button>
          </form>
        </dialog>
      </LocalizationProvider>
    </>
  );
}
