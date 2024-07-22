import React, { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";
import Calendar, {
  DateSelectArg,
  DateUnselectArg,
  DayCellMountArg,
  EventHoveringArg,
  EventMountArg,
  EventSourceInput,
} from "@fullcalendar/core";
import { Context, ContextType } from "@/app/clientWrappers/ContextProvider";
import "./FullCalExtraCss.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios, baseUrl } from "@/services/baseUrl";
import { getCookie, setCookie } from "@/hooks/CookieHooks";
import Endpoints from "@/services/API_ENDPOINTS";
import { useGetEvents } from "@/services/api/eventsApi";
import { parse, format } from "date-fns";
import { delay, generateNewToken } from "@/lib/utils";
import { useGetSemester } from "@/services/api/semester";

const allPlugins = [
  dayGridPlugin,
  multiMonthPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
  multiMonthPlugin,
];

export default function ReactFullCal() {
  const { calendarRef, setSelectedDate, selectedDate, timeout, events, users } =
    useContext(Context);
  const dayFrameRefs = useRef<HTMLDivElement[]>([]);

  const monthValue = new Date(selectedDate.start).getMonth();

  const queryClient = useQueryClient();
  const { mutate: updateHighLightedEvents } = useMutation({
    mutationFn: (payload: any) => Axios.patch("/profile", payload),
  });

  const { data: userData } = useQuery({
    queryKey: ["ProfileData"],
    // queryFn: async () => await Axios.get(Endpoints.profile),
    queryFn: async () => {
      try {
        const response = await Axios.get(`/profile`);
        const user = response.data.data;
        const token = await generateNewToken();
        if (token) {
          setCookie("token", token, 5);
        }
        return user;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
  });

  const handleSelect = ({ start, end, startStr, endStr }: DateSelectArg) => {
    setSelectedDate({ start, end, startStr, endStr });
    // console.log("eventselect", { start, end, startStr, endStr });
    clearTimeout(timeout.current);
  };

  console.log("events", events?.length);
  console.log(
    "events",
    JSON.stringify(
      events?.slice(
        parseInt(events?.length / 2) - 2,
        parseInt(events?.length / 2) - 1,
      ),
      null,
      4,
    ),
  );
  return (
    <>
      <div className="h-full w-auto ">
        <button
          className="btn btn-md"
          onClick={() =>
            calendarRef.current.getApi().changeView("multiMonthYear")
          }
        >
          Button for year view
        </button>
        <FullCalendar
          ref={calendarRef}
          plugins={allPlugins}
          initialView={`multiMonthYear`}
          events={
            events?.slice(
              parseInt(events?.length / 2) - 2,
              parseInt(events?.length / 2) + 2,
            ) as EventSourceInput
          }
        />
      </div>
    </>
  );
}
