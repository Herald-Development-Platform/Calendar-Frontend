import React from "react";
import { format } from "date-fns";
export default function EventCard({ event }: { event: eventType }) {
  const startTime = event?.start
    ? format(new Date(event.start), "h:mm aa")
    : "NA";
  const endTime = event?.end ? format(new Date(event?.end), "h:mm aa") : "NA";
  return (
    <>
      <div
        // key={event?._id}
        className="flex h-auto w-full flex-col gap-1 border-l-4 bg-opacity-10 px-4 py-2 text-black"
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
    </>
  );
}
