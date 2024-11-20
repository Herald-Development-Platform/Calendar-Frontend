"use client";

import { ROLES } from "@/constants/role";
import { setCookie } from "@/hooks/CookieHooks";
import { generateNewToken } from "@/lib/utils";
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
  RefObject,
} from "react";
import toast from "react-hot-toast";

function totalDaysInMonth(month:number, year:number) {
  // month is 1-indexed (1 for January, 2 for February, ..., 12 for December)
  if (month < 1 || month > 12) {
      throw new Error("Month must be between 1 and 12");
  }

  // Use Date object to calculate the last day of the given month
  return new Date(year, month, 0).getDate();
}


interface SelectedDateType {
  start: Date | undefined;
  end: Date | undefined;
  startStr: string | undefined;
  endStr: string | undefined;
}
export interface ContextType {
  events: eventType[] | undefined;
  setEvents: Dispatch<SetStateAction<eventType[] | undefined>>;
  calendarRef: RefObject<FullCalendar>;
  selectedDate: SelectedDateType | undefined;
  setSelectedDate: Dispatch<SetStateAction<SelectedDateType | undefined>>;
  calendarApi: CalendarApi | undefined;
  userData: User | undefined;
  notifications: any[];
  timeout: any;
  notificationsLoading: boolean;
  currentView: string;
  setCurrentView: Dispatch<SetStateAction<string>>;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  selectedEventData: eventType | null;
  setSelectedEventData: Dispatch<SetStateAction<eventType | null>>;
  calenderDate: SelectedDateType | undefined;
  setCalenderDate: Dispatch<SetStateAction<SelectedDateType | undefined>>;
}

export const Context = createContext<ContextType>({
  events: [],
  setEvents: () => {},
  calendarRef: { current: null },
  timeout: null,
  selectedDate: {
    start: undefined,
    end: undefined,
    startStr: undefined,
    endStr: undefined,
  },
  setSelectedDate: () => {},
  calendarApi: undefined,
  userData: undefined,
  notifications: [],
  notificationsLoading: true,
  currentView: "",
  setCurrentView: () => {},
  openDialog: false,
  setOpenDialog: () => {},
  selectedEventData: null,
  setSelectedEventData: () => {},
  calenderDate:{
    start: undefined,
    end: undefined,
    startStr: undefined,
    endStr: undefined,
  },
  setCalenderDate: () => {},
});
// const calendarRef = createRef(undefined);

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<eventType[] | undefined>();
  const [currentView, setCurrentView] = useState<string>("");

  const calendarApi = calendarRef?.current?.getApi();
  const timeout = useRef<any>();

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["Notification"],
    queryFn: () => Axios.get("/notification"),
  });

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { data: userData } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await Axios.get(`/profile`);
        const user = response.data.data;
        if (user) {
          if (
            user.syncWithGoogle &&
            (user.role === ROLES.SUPER_ADMIN || user.department)
          ) {
            syncWithGoogle();
          }
          const token = await generateNewToken();
          if (token) {
            setCookie("token", token, 5);
          }
        }
        return user;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return {};
      }
    },
  });

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

  const syncWithGoogle = async () => {
    try {
      const response = await Axios.post("/google/sync");
      console.log("SYNC response : ", response);
      if (response.data.success) {
        return response.data.data;
      } else {
        toast.error
      }
    } catch (error) {
      console.error("Error syncing with google:", error);
    }
  };
  const date = new Date();
    const currentDay = date.getDate();
    const lastDay = totalDaysInMonth(date.getMonth()+1, date.getFullYear());

  const [selectedDate, setSelectedDate] = useState<
    SelectedDateType | undefined
  >({
    start: new Date(),
    end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * (lastDay - currentDay)),
    endStr: "",
    startStr: "",
  });

  const [calenderDate, setCalenderDate] = useState<SelectedDateType | undefined>({
    start: new Date(),
    end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * (lastDay - currentDay)),
    endStr: "",
    startStr: "",
  });

  const [selectedEventData, setSelectedEventData] = useState<eventType | null>(null);

  return (
    <Context.Provider
      value={{
        currentView,
        setCurrentView,
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
        openDialog,
        setOpenDialog,
        selectedEventData,
        setSelectedEventData,
        calenderDate,
        setCalenderDate,
      }}
    >
      {children}
    </Context.Provider>
  );
}
