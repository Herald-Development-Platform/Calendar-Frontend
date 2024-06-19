import { Axios } from "@/services/baseUrl";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";
import { parseISO, format } from "date-fns";
import { getEvents } from "@/services/api/eventsApi";
import EventCard from "./EventCard";
import { Context } from "@/app/clientWrappers/ContextProvider";
import EventDetails from "@/app/(all-pages)/search/EventDetails";

export default function UpcommingEvents() {
  const { selectedDate } = useContext(Context);
  const { data: eventsData } = useQuery({
    queryKey: ["Events"],
    queryFn: getEvents,
  });
  const [selectedEvent, setSelectedEvent] = useState<eventType | null>(null);

  const upcommingEventRef = useRef<HTMLDivElement>(null);
  // console.log("eventsData", eventsData);

  // const dateString = "2024-05-18T05:25:00.000Z";

  // Parse the date string to a Date object
  // const date = parseISO(dateString);
  // const date = new Date(dateString);
  // console.log("date", new Date());
  // Format the date to the desired time format (h:mm aa for 12-hour clock with AM/PM)
  // const formattedTime = format(new Date(), "h:mm aa");
  // new Date('2024-05-18T05:25:00.000Z')

  // console.log(formattedTime); // Output: 5:25 AM
  const handleCardClick = (eventData: eventType) => {
    setSelectedEvent(eventData);
  };
  return (
    <div
      ref={upcommingEventRef}
      className="hide-scrollbar relative flex h-full w-1/3 flex-col gap-10 overflow-hidden  overflow-y-auto px-6"
    >
      <div className="flex flex-col gap-1 text-neutral-600">
        <h2 className="font-semibold ">Upcomming Events</h2>
        {/* <h3 className="text-lg">June 17 - June 23 </h3> */}
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex h-5 w-full items-center">
          <div className="w-full border-t border-neutral-300"></div>
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white px-2 text-sm text-neutral-600">
            {format(new Date(), "MMMM d")}
          </h1>
        </div>

        {/* {eventsData?.data?.data?.map((event: eventType, i: number) => {
          const startTime = event?.start
            ? format(new Date(event.start), "h:mm aa")
            : "NA";
          const endTime = event?.end
            ? format(new Date(event?.end), "h:mm aa")
            : "NA";
          return (
            <div
              key={event?._id}
              className="flex h-16 w-full flex-col gap-1 border-l-4 bg-opacity-10 px-4 py-2"
              style={{
                backgroundColor: `${event?.color}14`,
                borderWidth: "0 0 0 4px",
                borderColor: `${event?.color}`,
              }}
            >
              <h1 className=" font-medium">{event?.title}</h1>
              <p className="text-sm font-medium text-neutral-600">
                {startTime} - {endTime}
              </p>
            </div>
          );
        })} */}
        {eventsData?.data?.data?.map((event: eventType, i: number) => {
          const selectedStartTime = selectedDate.start.getTime();
          const selectedEndTime = selectedDate?.end
            ? selectedDate.end.getTime()
            : 0;
          const eventStart = event?.start ? new Date(event.start).getTime() : 0;
          const eventEnd = event?.end ? new Date(event.end).getTime() : 0;

          if (eventStart < selectedStartTime || eventStart > selectedEndTime)
            return;
          return (
            <EventCard
              key={event._id}
              event={event}
              handleCardClick={handleCardClick}
            />
          );
        })}
      </div>
      <EventDetails
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        updateEvent={() => {}}
        width={
          upcommingEventRef.current
            ? upcommingEventRef.current.offsetWidth
            : null
        }
      ></EventDetails>
    </div>
  );
}

// function hexToRgba(hex: string, opacity: number) {
//   // Remove the hash at the start if it's there
//   hex = hex.replace(/^#/, "");

//   // Parse the r, g, b values
//   let bigint = parseInt(hex, 16);
//   let r = (bigint >> 16) & 255;
//   let g = (bigint >> 8) & 255;
//   let b = bigint & 255;

//   // Return the RGBA string
//   return `rgba(${r}, ${g}, ${b}, ${opacity})`;
// }
