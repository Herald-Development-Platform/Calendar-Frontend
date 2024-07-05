import { Axios } from "@/services/baseUrl";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";
import { parseISO, format } from "date-fns";
import {
  getEvents,
  useDeleteEvent,
  useGetEvents,
  useUpdateEvents,
} from "@/services/api/eventsApi";
import EventCard from "./EventCard";
import { Context } from "@/app/clientWrappers/ContextProvider";
import EventDetails from "@/app/(all-pages)/search/EventDetails";

export default function UpcommingEvents() {
  const [selectedEvent, setSelectedEvent] = useState<eventType | null>(null);
  let lastDate: string;

  const { selectedDate, timeout } = useContext(Context);

  const selectedStartTime = selectedDate?.start
    ? selectedDate?.start.getTime()
    : 0;

  const selectedEndTime = selectedDate?.end ? selectedDate.end.getTime() : 0;

  const upcommingEventRef = useRef<HTMLDivElement>(null);

  const { data: eventsData } = useGetEvents();

  const { mutate: deleteEvent } = useDeleteEvent({});
  const { mutate: updateEvent } = useUpdateEvents();

  const handleCardClick = (eventData: eventType) => {
    clearTimeout(timeout.current);
    setSelectedEvent(eventData);

    if (!upcommingEventRef?.current) return;
    upcommingEventRef.current.scrollTop = 0;
  };

  const handleDelete = (e: any) => {
    const { value } = e.target;
    // setSelectedEvent(null);
    deleteEvent({ id: value });
  };

  return (
    <div
      ref={upcommingEventRef}
      className={`${
        selectedEvent ? "" : "overflow-y-auto"
      } hide-scrollbar relative flex h-full w-1/3 flex-col gap-10 overflow-hidden px-6`}
    >
      <div className="flex flex-col gap-1 text-neutral-600 ">
        <h2 className="font-semibold ">Upcomming Events</h2>
        <h3 className="text-lg ">
          {selectedStartTime && format(new Date(selectedStartTime), "MMMM d")} -
          {selectedEndTime && format(new Date(selectedEndTime), "MMMM d")}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {eventsData &&
          eventsData?.map((event: eventType, i: number) => {
            let inFirstEdge = null;
            let inBetween = null;
            let inLastEdge = null;

            const eventStart = event?.start
              ? new Date(event.start).getTime()
              : 0;
            const eventEnd = event?.end ? new Date(event.end).getTime() : 0;

            inFirstEdge =
              eventStart < selectedStartTime && eventEnd > selectedStartTime;
            inBetween =
              eventStart > selectedStartTime && eventEnd < selectedEndTime;
            inLastEdge =
              eventStart < selectedEndTime && eventEnd > selectedEndTime;

            if (!inFirstEdge && !inBetween && !inLastEdge) return;

            let displayDate = false;
            if (lastDate !== format(new Date(eventStart), "MMMM d")) {
              lastDate = format(new Date(eventStart), "MMMM d");
              displayDate = true;
            }

            return (
              <>
                {displayDate && (
                  <div className="relative flex h-5 w-full items-center">
                    <div className="w-full border-t border-neutral-300"></div>
                    <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white px-2 text-sm text-neutral-600">
                      {lastDate && format(new Date(lastDate), "MMMM d")}
                    </h1>
                  </div>
                )}
                <EventCard
                  key={event._id}
                  event={event}
                  handleCardClick={handleCardClick}
                />
              </>
            );
          })}
      </div>
      <EventDetails
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        updateEvent={updateEvent}
        handleDelete={handleDelete}
        width={
          upcommingEventRef.current
            ? upcommingEventRef.current.offsetWidth
            : null
        }
      ></EventDetails>
    </div>
  );
}
