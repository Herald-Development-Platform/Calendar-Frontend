"use client";

import { setCookie } from "@/hooks/CookieHooks";
import { Axios } from "@/services/baseUrl";
import { CalendarApi, EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import {
  createContext,
  useRef,
  useState,
  SetStateAction,
  Dispatch,
  LegacyRef,
  useEffect,
} from "react";

export interface ContextType {
  events: EventInput[];
  setEvents: Dispatch<SetStateAction<EventInput[]>>;
  calendarRef: LegacyRef<FullCalendar> | undefined;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  calendarApi: CalendarApi | undefined;
  userData: User | undefined;
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

  const [userData, setUserData] = useState<User>();

  const generateNewToken = async () => {
    try {
      const response = await Axios.get("/generateNewToken");
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await Axios.get(`/profile`);
      const user = response.data.data;
      if (user) {
        setUserData(user);
        const token = await generateNewToken();
        if (token) {
          setCookie("token", token, Date.now()+(5*86400));
        }
      }
      console.log("UserData: ", response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


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
        userData,
      }}
    >
      {children}
    </Context.Provider>
  );
}
