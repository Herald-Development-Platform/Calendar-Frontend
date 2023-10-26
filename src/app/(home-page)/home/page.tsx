"use client";
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
// import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/sass/styles.scss";
// import "./react-big-calendar.css";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import US_LocaleData from "date-fns/locale/en-US";
import { AiOutlinePlus } from "react-icons/ai";
import AddEventModal from "@/components/AddEventModal";
import UpcommingEvents from "@/components/UpcommingEvents";

//data that defines the format of date and time for the calendar component.
const locales = {
  "en-US": US_LocaleData,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events: eventType[] = [
  {
    title: "Big Meeting",
    start: new Date(2023, 10, 22),
    end: new Date(2023, 10, 23),
  },
  {
    title: "event",
    start: new Date(2023, 10, 22),
    end: new Date(2023, 10, 24),
  },
  {
    title: "Important Lecture",
    start: new Date(2023, 11, 22),
    end: new Date(2023, 11, 23),
  },
];
export default function page() {
  const [allEvents, setAllEvents] = useState<eventType[]>(events);

  useEffect(() => {
    console.log("allEvents", allEvents);
  }, [allEvents]);
  return (
    <div className="w-full">
      <h1>Calendar</h1>
      <h2>Add new event</h2>

      <div>
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

        <AddEventModal allEvents={allEvents} setAllEvents={setAllEvents} />
      </div>
      <div className="relative flex max-w-full justify-between">
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor={"start"}
          endAccessor={"end"}
          style={{ height: 625, width: 770, margin: "50px" }}
        />
        <UpcommingEvents />
      </div>
    </div>
  );
}
