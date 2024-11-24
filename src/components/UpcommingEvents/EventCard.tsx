import React, { useContext } from "react";
import { format } from "date-fns";
import { Dot } from "lucide-react";
import { LuDot } from "react-icons/lu";
import { Context } from "@/app/clientWrappers/ContextProvider";
import { ROLES } from "@/constants/role";

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


  const {setSelectedEventData} = useContext(Context)
  
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
          setSelectedEventData(event);
        }}
      >
        <div className="flex items-start justify-start">
          <div className="flex w-[80%] flex-wrap gap-1">
            {event?.departments?.map((department: any, i: number) => {
              return (
                <div
                  key={i}
                  className={`${
                    (i === 0 && event?.createdBy?.role !== ROLES.SUPER_ADMIN )
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
          {event?.start &&
            new Date(event.start).getDate() !==
              new Date(event.end || "").getDate() && (
              <span
                className="ml-auto text-[12px]"
                style={{
                  color: event.color,
                }}
              >
                MD
              </span>
            )}
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
