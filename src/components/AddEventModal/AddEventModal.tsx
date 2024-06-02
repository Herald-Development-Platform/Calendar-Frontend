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
import { baseUrl } from "@/services/baseUrl";
import * as CookieHooks from "@/hooks/CookieHooks";
import { useGetCookieByName } from "@/hooks/CookieHooks";
import { DEPARTMENTS } from "@/constants/departments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const colors = [
  "#9852F4",
  "#F0BA16",
  "#F45293",
  "#F45252",
  "#FF8447",
  "#47A3FF",
  "#6647FF",
];

export default function AddEventModal() {
  const [pickedDate, setPickedDate] = useState<Date | null>();

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
    department: undefined,
    notes: "",
  });

  const { mutate: postNewEvent } = useMutation({
    mutationFn: (payload: any) =>
      fetch(`${baseUrl}/event`, {
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Events"] });
      toast.success(`${res.message}`);
      setNewEvent({
        title: "",
        start: null,
        end: null,
        color: undefined,
        duration: 0,
        location: "",
        description: undefined,
        department: undefined,
        notes: "",
      });
    },
  });

  function handleAddEvent() {
    console.log("handle add event ", newEvent);
    // setEvents([...events, newEvent]);
    postNewEvent(newEvent);
    // setNewEvent({
    //   title: "",
    //   start: null,
    //   end: null,
    //   color: undefined,
    //   duration: 0,
    //   location: "",
    //   description: undefined,
    //   department: undefined,
    //   notes: "",
    // });
    // fetch(`${baseUrl}/event`, {
    //   method: "POST",
    //   body: JSON.stringify(newEvent),
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
  }

  const setDateAndTime = ({ hours, minutes, type }: setDateAndTimeTypes) => {
    if (pickedDate) {
      console.log("selected date in setdateandtime function:", pickedDate);
      const date = format(pickedDate, "yyyy-MM-dd", {
        locale: US_LocaleData,
      });

      const finalDate = new Date(date);
      finalDate?.setHours(hours);
      finalDate?.setMinutes(minutes);

      if (type === "start") {
        setNewEvent({ ...newEvent, start: finalDate });
      } else if (type === "end") {
        setNewEvent({ ...newEvent, end: finalDate });
      }
    }
  };

  return (
    <>
      <button
        className="btn btn-sm
           relative flex h-8 rounded border-none bg-primary-600 text-sm font-medium text-primary-50 outline-none hover:bg-primary-400"
        onClick={() => {
          const modal_3 = document.getElementById(
            "my_modal_3",
          ) as HTMLDialogElement;
          modal_3.showModal();
        }}
      >
        <AiOutlinePlus className="h-4 w-4 text-primary-50" />
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
                  className="w-full font-normal text-neutral-900 outline-none"
                  placeholder="Add Title"
                  id="add-title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
            </label>

            {/* Date Input section */}
            <label htmlFor="date" className="flex flex-col gap-2">
              <span>Date</span>
              <Datepicker
                className="h-10 w-full rounded border-[1px] border-neutral-300 text-neutral-900 outline-none focus:border-primary-600"
                onChange={(datePicked) => {
                  setPickedDate(datePicked);
                  console.log("PickedDate", datePicked);
                }}
                value={
                  pickedDate
                    ? format(pickedDate, "EEEE, dd MMMM", {
                        locale: US_LocaleData,
                      })
                    : undefined
                }
                placeholderText="Please select a date."
                required
              />
              {/* <input
                type="date"
                id="date"
                className="input-container h-10 w-full rounded border-[1px] border-neutral-300 text-neutral-900 outline-none focus:border-primary-600"
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  // setSelectedDate2(datePicked);

                  console.log("selectedDate", e.target.value);
                }}
              /> */}
            </label>

            {/* Time input section */}
            <div className="flex flex-col">
              <div className="flex gap-4">
                <div className="flex w-full  flex-col ">
                  <span>From</span>
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
                  <span>To</span>
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
              Color
              <div className="flex gap-2">
                {colors.map((Color, i) => (
                  <label
                    className={`btn checkbox btn-xs relative h-7 w-7 cursor-pointer rounded-none border-none`}
                    style={{ backgroundColor: Color }}
                    htmlFor={`ColorInput${i}`}
                    key={i}
                  >
                    <input
                      type="checkbox"
                      className={
                        Color == newEvent.color
                          ? "absolute h-full w-full border-none text-white"
                          : "absolute hidden h-full w-full border-none text-white"
                      }
                      style={{
                        accentColor: Color,
                      }}
                      checked={Color == newEvent.color}
                      readOnly
                    />
                    <input
                      name={"color"}
                      id={`ColorInput${i}`}
                      type="radio"
                      className="absolute hidden"
                      onChange={() => {
                        setNewEvent({ ...newEvent, color: Color });
                        console.log(`index ${i} clicked, Color: ${Color}`);
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Location section  */}
            <div>
              Location <br />
              <input
                type="text"
                className="h-10 w-full rounded border-[1px] border-neutral-300 text-neutral-900 focus:border-primary-600"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </div>

            {/* Description section  */}
            <div className="w-full">
              Description <br />
              <textarea
                className="textarea textarea-bordered w-full text-neutral-900 focus:border-primary-600 focus:outline-none"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              ></textarea>
            </div>

            {/* Departments section  */}
            <div className="">
              Departments <br />
              <select
                className="select select-bordered h-10 w-full  rounded border-[1px] border-neutral-300 text-neutral-900 focus:border-primary-600 focus:outline-none"
                defaultValue={""}
                onChange={(e) =>
                  setNewEvent((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              >
                <option disabled value={""}>
                  Choose the departments
                </option>
                {Object.values(DEPARTMENTS).map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes section  */}
            <div className="">
              <span>Notes</span> <br />
              <input
                type="text"
                className="h-10 w-full rounded border-[1px] border-neutral-300 text-neutral-900 focus:border-primary-600"
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
