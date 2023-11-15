"use client";

import FullCalendar from "@fullcalendar/react";
import { createContext, useRef, useState, createRef } from "react";

export const Context = createContext({});
// const calendarRef = createRef(undefined);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events, setEvents] = useState<eventType[]>([
    {
      title: "event1",
      start: new Date(),
      end: new Date(),
    },
  ]);
  const calendarRef = useRef<FullCalendar | undefined | null>();
  const calendarApi = calendarRef?.current?.getApi();
  console.log("calendar getDate()", calendarApi);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // console.log("context events", events);
  return (
    <Context.Provider
      value={{ events, setEvents, calendarRef, selectedDate, setSelectedDate }}
    >
      {children}
    </Context.Provider>
  );
}
