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

export const Context = createContext<any>({});
// const calendarRef = createRef(undefined);

interface SelectedDate {
  start?: Date;
  end?: Date;
  endStr: string;
  startStr: string;
}

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<EventInput[]>();
  const calendarApi = calendarRef?.current?.getApi();
  console.log("calendar getDate()", calendarApi);

  const [selectedDate, setSelectedDate] = useState<SelectedDate | undefined>({
    start: new Date(),
    end: undefined,
    endStr: "",
    startStr: "",
  });

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
