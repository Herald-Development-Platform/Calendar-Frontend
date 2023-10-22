"use client";
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import US_LocaleData from "date-fns/locale/en-US";
import { AiOutlinePlus } from "react-icons/ai";

type eventType = {
  title: string;
  allDay?: boolean;
  start: Date | null;
  end: Date | null;
};

//data that defines the format of the calendar component.
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
    allDay: true,
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
  const [newEvent, setNewEvent] = useState<eventType>({
    title: "",
    start: null,
    end: null,
  });
  const [allEvents, setAllEvents] = useState(events);

  function handleAddEvent() {
    setAllEvents([...allEvents, newEvent]);
  }
  return (
    <div>
      <h1>Calendar</h1>
      <h2>Add new event</h2>

      <div>
        <input
          type="text"
          placeholder="Add Title"
          // style={{ width: "20%", marginRight: "10px" }}
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker
          placeholderText="StartDate"
          // style={{ marginRight: "10px" }}
          selected={newEvent.start}
          onChange={(start) => setNewEvent({ ...newEvent, start })}
        />
        <DatePicker
          placeholderText="EndDate"
          // style={{ marginRight: "10px" }}
          selected={newEvent.end}
          onChange={(end) => setNewEvent({ ...newEvent, end })}
        />
        <button
          className="btn btn-sm
           relative flex h-8  rounded bg-primary-600 text-sm font-medium text-primary-50"
          onClick={handleAddEvent}
        >
          <AiOutlinePlus className="h-4 w-4 text-primary-50" />
          Add Event
        </button>
      </div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor={"start"}
        endAccessor={"end"}
        style={{ height: 500, margin: "50px" }}
      />
    </div>
  );
}
