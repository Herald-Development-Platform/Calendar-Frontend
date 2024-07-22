"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Headers from "@/components/Header";
import RecentSearches from "@/components/RecentSearches/RecentSearches";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEventsByParams,
  updateEvents,
  useDeleteEvent,
  useGetEventByQuery,
  useUpdateEvents,
} from "@/services/api/eventsApi";

import { BsDot } from "react-icons/bs";
import { format } from "date-fns";
import { RxArrowTopRight } from "react-icons/rx";
import EventDetails from "./EventDetails";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/router";
import { Context } from "@/app/clientWrappers/ContextProvider";

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<eventType | null>(null);
  const [queryParams, setQueryParams] = useState<eventByParamsType>({
    q: "",
    departments: [],
    colors: [],
    eventTo: "",
    eventFrom: "",
  });
  const [filteredEvents, setFilteredEvents] = useState<eventType[]>();
  const filteredEventsRef = useRef<HTMLDivElement>(null);

  const widthOfEventDetail = filteredEventsRef.current
    ? filteredEventsRef.current?.offsetWidth / 1.3
    : null;
  const {
    data: eventsData,
    refetch,
    isFetching,
  } = useGetEventByQuery(queryParams);

  const { mutate: deleteEvent } = useDeleteEvent({});
  const { mutate: updateEvent } = useUpdateEvents();

  const handleDelete = (e: any) => {
    const { value } = e.target;
    deleteEvent({ id: value });
  };

  console.log("queryParams", queryParams);
  console.log("filteredEvents", filteredEvents);

  const handleQueryParams = (e: any) => {
    const { name, value } = e.target;

    console.log("departmentAdd", value);
    let startDate, endDate;
    switch (name) {
      case "query":
        setQueryParams((prev) => ({ ...prev, q: value }));
        break;

      case "department":
        const departmentExists = queryParams?.departments?.includes(value);

        if (departmentExists)
          setQueryParams((prev) => ({
            ...prev,
            departments: [
              ...queryParams?.departments?.filter(
                (departmentCode) => departmentCode !== value,
              ),
            ],
          }));
        else
          setQueryParams((prev) => ({
            ...prev,
            departments: [...queryParams.departments, value],
          }));
        break;

      case "colors":
        queryParams.colors.includes(value)
          ? setQueryParams((prev) => ({
              ...prev,
              colors: [
                ...queryParams.colors.filter((color) => color !== value),
              ],
            }))
          : setQueryParams((prev) => ({
              ...prev,
              colors: [...queryParams.colors, value],
            }));
        break;

      case "single":
        console.log("singledate", new Date(value).getTime());
        {
          const startDate = new Date(value);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);

          setQueryParams((prev) => ({
            ...prev,
            eventFrom: startDate.getTime(),
            eventTo: endDate.getTime(),
          }));
        }
        break;

      case "multiStart":
        {
          const startDate = new Date(value);

          setQueryParams((prev) => ({
            ...prev,
            eventFrom: startDate.getTime(),
          }));
        }
        break;

      case "multiEnd":
        {
          const endDate = new Date(value);
          setQueryParams((prev) => ({
            ...prev,
            eventTo: endDate.getTime(),
          }));
        }
        break;
      case "reset":
        {
          const endDate = new Date(value);
          setQueryParams((prev) => ({
            ...prev,
            eventTo: "",
            eventFrom: "",
          }));
        }
        break;
    }
  };

  const handleFilterEvent = () => {
    let filteredData = eventsData?.filter((event: eventType) => {
      const reg = new RegExp(queryParams.q, "ig");

      const isRegexValid =
        reg.test(event.title) ||
        (event.description && reg.test(event.description));

      const departmentExist: boolean =
        queryParams.departments.length === 0 ||
        event.departments.some((department: any) =>
          queryParams.departments.includes(department._id),
        );

      const isColor =
        queryParams.colors.length === 0 ||
        (event.color && queryParams.colors.includes(event.color));

      const selectedStartTime = queryParams.eventFrom
        ? queryParams.eventFrom
        : 0;
      const selectedEndTime = queryParams.eventTo ? queryParams.eventTo : 0;

      const eventStart = event?.start ? new Date(event.start).getTime() : 0;
      const eventEnd = event?.end ? new Date(event.end).getTime() : 0;
      console.log("eventStart", eventStart, "eventEnd", eventEnd);
      const inFirstEdge =
        eventStart <= selectedStartTime && eventEnd > selectedStartTime;
      const inBetween =
        eventStart > selectedStartTime && eventEnd < selectedEndTime;
      const inLastEdge =
        eventStart < selectedEndTime && eventEnd >= selectedEndTime;

      const isDateValid =
        selectedStartTime === 0 ||
        selectedEndTime === 0 ||
        inFirstEdge ||
        inBetween ||
        inLastEdge;

      return isRegexValid && departmentExist && isColor && isDateValid;

      // const
    });

    setFilteredEvents(filteredData);
  };

  useDebounce({
    dependency: [queryParams, eventsData],
    debounceFn: () => handleFilterEvent(),
    time: 150,
  });

  return (
    <div className="flex h-full flex-col gap-9 overflow-hidden pl-8 pt-10 ">
      <Headers.SearchHeader
        queryParams={queryParams}
        handleQueryParams={handleQueryParams}
      />

      <div className="relative flex h-full w-full flex-grow flex-col">
        <div
          ref={filteredEventsRef}
          className="flex h-full w-1/2 flex-col gap-2 pb-20"
        >
          <p className="text-base text-neutral-500">All Events</p>
          <div className="green-scrollbar flex flex-grow flex-col overflow-hidden overflow-y-auto">
            {Boolean(filteredEvents) &&
              filteredEvents?.map((event: eventType, i: number) => (
                <div
                  onClick={() => setSelectedEvent(event)}
                  key={i}
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
          updateEvent={updateEvent}
          width={widthOfEventDetail}
          handleDelete={handleDelete}
        ></EventDetails>
      </div>
    </div>
  );
}
