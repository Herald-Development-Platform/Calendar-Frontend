//tsoding daily
import React, { useContext, useEffect, useRef, useState } from "react";
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

export default function UpcommingEvents({ elHeight }: { elHeight: number }) {
  const [selectedEvent, setSelectedEvent] = useState<eventType | null>(null);
  let lastDate: string;

  const { calenderDate, timeout, currentView, setSelectedEventData } =
    useContext(Context);
  const selectedStartTime = calenderDate?.start
    ? calenderDate?.start.getTime()
    : 0;
  const selectedEndTime = calenderDate?.end ? calenderDate.end.getTime() : 0;

  const upcommingEventRef = useRef<HTMLDivElement>(null);

  const { data: eventsData, isLoading: eventsLoading } = useGetEvents();

  useEffect(() => {
    if (selectedEvent && eventsData?.length && eventsData?.length > 0) {
      let newlyFetchedSelectedEvent = eventsData.find(
        (event: eventType) => event._id === selectedEvent._id,
      );
      if (newlyFetchedSelectedEvent) {
        setSelectedEvent(newlyFetchedSelectedEvent);
      }
    }
  }, [eventsData]);

  const { mutate: deleteEvent } = useDeleteEvent({});
  const { mutate: updateEvent } = useUpdateEvents();

  const handleCardClick = (eventData: eventType) => {
    clearTimeout(timeout.current);
    setSelectedEvent(eventData);
    // setSelectedEventData(eventData);

    if (!upcommingEventRef?.current) return;
    upcommingEventRef.current.scrollTop = 0;
  };

  const handleDelete = (e: any) => {
    const { value } = e.target;
    deleteEvent({ id: value });
  };

  return (
    <div
      ref={upcommingEventRef}
      id="upcomming-events"
      className={`${
        selectedEvent ? "" : ""
      } hide-scrollbar relative flex h-auto w-1/3 flex-col gap-10 overflow-hidden px-6`}
      style={{
        height: currentView !== "multiMonthYear" ? `${elHeight}px` : `100%`,
      }}
    >
      <div className="flex flex-col gap-1 text-neutral-600 ">
        <h2 className="font-semibold">Upcomming Events</h2>
        <h3 className="text-lg ">
          {selectedStartTime && format(new Date(selectedStartTime), "MMMM d")} -
          {selectedEndTime && format(new Date(selectedEndTime), "MMMM d")}
        </h3>
      </div>

      <div className="hide-scrollbar flex flex-col gap-3 overflow-y-auto">
        {eventsLoading ? (
          <></>
        ) : eventsData?.length && eventsData?.length > 0 ? (
          eventsData?.map((event: eventType, i: number) => {
            let inFirstEdge = null;
            let inBetween = null;
            let inLastEdge = null;

            const eventStart = event?.start
              ? new Date(event.start).getTime()
              : 0;
            const eventEnd = event?.end ? new Date(event.end).getTime() : 0;

            inFirstEdge =
              eventStart <= selectedStartTime && eventEnd > selectedStartTime;
            inBetween =
              eventStart > selectedStartTime && eventEnd < selectedEndTime;
            inLastEdge =
              eventStart < selectedEndTime && eventEnd >= selectedEndTime;

            if (!inFirstEdge && !inBetween && !inLastEdge) return;

            let displayDate = false;

            if (lastDate !== format(new Date(eventStart), "MMMM d")) {
              lastDate = format(new Date(eventStart), "MMMM d");
              displayDate = true;
            }

            return (
              <React.Fragment key={event._id}>
                {displayDate && (
                  <div className="relative mt-2 flex h-5 w-full items-center">
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
              </React.Fragment>
            );
          })
        ) : (
          <></>
        )}
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
