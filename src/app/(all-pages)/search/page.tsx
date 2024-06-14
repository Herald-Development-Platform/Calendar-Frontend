"use client";
import React, { useEffect, useState } from "react";
import * as Headers from "@/components/Header";
import RecentSearches from "@/components/RecentSearches/RecentSearches";
import { useQuery } from "@tanstack/react-query";
import { getEventsByParams } from "@/services/api/eventsApi";
import { Axios } from "@/services/baseUrl";
import Endpoints from "@/services/API_ENDPOINTS";
import { BsDot } from "react-icons/bs";
import { format } from "date-fns";
import { RxArrowTopRight } from "react-icons/rx";
import EventDetails from "./EventDetails";

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<eventType | null>(null);

  const [queryParams, setQueryParams] = useState({
    q: "",
    departments: [""],
  });
  console.log("queryParams", queryParams);
  const { data: filteredEvents, refetch } = useQuery({
    queryKey: ["Events", queryParams],
    queryFn: () =>
      Axios.get(
        Endpoints.eventByQuery({
          query: queryParams.q,
          departments: queryParams.departments,
        }),
      ),
  });

  // useEffect(() => {
  //   clearTimeout(timeout);
  //   timeout = setTimeout(() => {
  //     refetch();
  //   }, 500);
  // }, [queryParams]);

  console.log("filteredEvents", filteredEvents);

  let timeout: any;
  const handleQueryParams = (e: any) => {
    setQueryParams((prev) => ({ ...prev, q: e.target.value }));
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      refetch();
    }, 1000);
  };

  return (
    <div className="flex h-full  flex-col gap-9 overflow-hidden pl-8 pt-10 ">
      <Headers.SearchHeader
        queryParams={queryParams}
        handleQueryParams={handleQueryParams}
      />

      <div className="relative flex h-full w-full flex-grow flex-col">
        <div className="flex h-full w-1/2 flex-col gap-2 pb-20">
          <p className="text-base text-neutral-500">Recent Searches</p>
          <div className="flex flex-grow flex-col overflow-hidden overflow-y-auto">
            {filteredEvents?.data?.data?.map((event: eventType, i: number) => (
              <div
                onClick={() => setSelectedEvent(event)}
                key={event._id}
                className="group flex items-center gap-4 rounded-md px-3 py-[6px] hover:bg-neutral-100"
              >
                <span
                  className="h-8 w-8 rounded-md"
                  style={{ backgroundColor: `${event?.color}` }}
                ></span>
                <div className="flex flex-grow flex-col">
                  <header className="text-base font-medium leading-6 text-neutral-900">
                    {event?.title}
                  </header>
                  <p className="flex items-center  text-xs font-normal text-neutral-500">
                    <span className="text-sm font-medium text-neutral-600 ">
                      Event
                    </span>
                    <span className="text-xl ">
                      <BsDot />
                    </span>
                    <span>
                      {event?.start &&
                        format(new Date(event.start), "yyyy/MM/dd")}
                    </span>
                  </p>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm opacity-0 group-hover:opacity-100">
                  <RxArrowTopRight />
                </span>
              </div>
            ))}
          </div>
        </div>

        <EventDetails
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        ></EventDetails>
      </div>
    </div>
  );
}
