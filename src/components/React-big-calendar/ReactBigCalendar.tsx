"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "react-big-calendar/lib/sass/styles.scss";
import "./react-big-calendar.css";
// import "react-datepicker/dist/react-datepicker.css";
import US_LocaleData from "date-fns/locale/en-US";
import "./calendarStyles.css";

//data that defines the format of date and time for the calendar component.
const locales = {
  "en-US": US_LocaleData,
};

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
export default function ReactBigCalendar({
  date,
  setDate,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}) {
  const localizer = useMemo(
    () =>
      dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
      }),
    [],
  );

  const formats = useMemo(
    () => ({
      weekdayFormat: (date: Date) => format(date, "EEE"),
    }),
    [],
  );

  const [allEvents, setAllEvents] = useState<eventType[]>(events);

  useEffect(() => {
    console.log("allEvents", allEvents);
  }, [allEvents]);
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        date={date}
        startAccessor={"start"}
        endAccessor={"end"}
        style={{ height: 625, width: 770, margin: "50px" }}
        toolbar={false}
        formats={formats}
      />
    </div>
  );
}
