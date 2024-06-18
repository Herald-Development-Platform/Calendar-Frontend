import React from "react";
import { format } from "date-fns";
export default function EventCard({
  event,
  handleCardClick,
}: {
  event: eventType;
  handleCardClick?: (eventData: eventType) => void;
}) {
  const startTime = event?.start
    ? format(new Date(event.start), "h:mm aa")
    : "NA";
  const endTime = event?.end ? format(new Date(event?.end), "h:mm aa") : "NA";
  if (!event?.start) return null;
  // console.log(
  //   "starttime",
  //   format(new Date(event.start), "yyyy MM dd"),
  //   format(new Date(), "yyyy MM dd"),
  // );

  // if (
  //   format(new Date(event.start), "yyyy MM dd") !==
  //   format(new Date(), "yyyy MM dd")
  // )
  //   return;
  return (
    <>
      <div
        // key={event?._id}
        className={`${
          Boolean(handleCardClick) ? "cursor-pointer" : ""
        } flex h-auto w-full cursor-pointer flex-col gap-1 border-l-4 bg-opacity-10 px-4 py-2 text-black`}
        style={{
          backgroundColor: `${event?.color}14`,
          borderWidth: "0 0 0 4px",
          borderColor: `${event?.color}`,
        }}
        onClick={() => {
          handleCardClick && handleCardClick(event);
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
