import React from "react";
import { format } from "date-fns";
import { Dot } from "lucide-react";
import { LuDot } from "react-icons/lu";

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

  // console.log("event", event);
  return (
    <>
      <div
        key={event?._id}
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
        <h1 className="font-medium">{event?.title}</h1>
        <div className="flex items-center text-neutral-600">
          {//  departments =event.departments;
          event?.departments?.map((department: any, i: number) =>
            i < 2 ? (
              <>
                <p className="whitespace-pre text-sm font-medium ">
                  {department.code} {i < event.departments.length - 1 && "/ "}
                </p>
                {i == event.departments.length - 1 && (
                  <span className="ml-[-5px] text-2xl">
                    <LuDot />
                  </span>
                )}
              </>
            ) : (
              <p
                key={department._id}
                className="whitespace-pre text-sm font-medium "
              >
                .
              </p>
            ),
          )}

          <p className="text-sm font-medium ">
            {startTime} - {endTime}
          </p>
        </div>
      </div>
    </>
  );
}
