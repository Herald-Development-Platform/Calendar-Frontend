"use client";

import { setCookie } from "@/hooks/CookieHooks";
import { Axios } from "@/services/baseUrl";
import { CalendarApi, EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import { useQuery } from "@tanstack/react-query";
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
  notifications: any[];
  notificationsLoading: boolean;
}

export const Context = createContext<any>({});
// const calendarRef = createRef(undefined);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<EventInput[]>();
  const calendarApi = calendarRef?.current?.getApi();
  const timeout = useRef<any>();
  // calendarApi.

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["Notification"],
    queryFn: () => Axios.get("/notification"),
  });

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
  };

  const fetchUserData = async () => {
    try {
      const response = await Axios.get(`/profile`);
      const user = response.data.data;
      if (user) {
        setUserData(user);
        const token = await generateNewToken();
        if (token) {
          setCookie("token", token, 5);
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
    end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
    endStr: "",
    startStr: "",
  });

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
        timeout,
        notifications: notifications?.data?.data,
        notificationsLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
}
