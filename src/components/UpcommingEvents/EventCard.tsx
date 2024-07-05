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
        <div className="flex w-full flex-wrap gap-1">
          {event?.departments?.map((department: any, i: number) => {
            return (
              <div
                className={`${
                  i === 0
                    ? "bg-neutral-400 text-white"
                    : "bg-white text-neutral-400"
                } flex h-[15px] items-center justify-center rounded-[20px] border-[0.4px] border-neutral-400  px-[5px] text-[11px] `}
              >
                <span className="flex h-full items-center justify-center pt-[2px]">
                  {department?.code}
                </span>
              </div>
            );
          })}
        </div>
        <h1 className="font-medium">{event?.title}</h1>
        <div className="flex items-center text-neutral-600">
          <p className="text-sm font-medium ">
            {startTime} - {endTime}
          </p>
        </div>
      </div>
    </>
  );
}
