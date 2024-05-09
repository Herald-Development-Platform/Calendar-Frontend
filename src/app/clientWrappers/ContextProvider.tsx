"use client";

import { CalendarApi, EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import {
  createContext,
  useRef,
  useState,
  SetStateAction,
  Dispatch,
  LegacyRef,
} from "react";

export interface ContextType {
  events: EventInput[];
  setEvents: Dispatch<SetStateAction<EventInput[]>>;
  calendarRef: LegacyRef<FullCalendar> | undefined;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  calendarApi: CalendarApi | undefined;
}

export const Context = createContext<ContextType>({});
// const calendarRef = createRef(undefined);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<EventInput[]>([
    {
      title: "event1",
      start: new Date(),
      end: new Date(),
    },
    {
      title: "event2",
      start: new Date(),
      end: new Date(),
    },
    {
      title: "event3",
      start: new Date(),
      end: new Date(),
    },
    {
      title: "event4",
      start: new Date(),
      end: new Date(),
    },
    {
      title: "event5",
      start: new Date(),
      end: new Date(),
    },
  ]);
  const calendarApi = calendarRef?.current?.getApi();
  console.log("calendar getDate()", calendarApi);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // console.log("context events", events);
  return (
    <Context.Provider
      value={{
        events,
        setEvents,
        calendarRef,
        calendarApi,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </Context.Provider>
  );
}
