import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import EventCard from "@/components/UpcommingEvents/EventCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import colors from "@/constants/Colors";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function EventDetails({
  selectedEvent,
  setSelectedEvent,
}: {
  selectedEvent: eventType | null;
  setSelectedEvent: Dispatch<SetStateAction<eventType | null>>;
}) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    selectedEvent?.color,
  );

  useEffect(() => {
    console.log("selected", Boolean(selectedEvent));
    setSelectedColor(selectedEvent?.color);
  }, [selectedEvent]);

  return (
    <section
      className={`${
        Boolean(selectedEvent) ? "" : "translate-x-full"
      } absolute right-0 top-0 flex h-auto w-80 flex-col  gap-6 p-6 font-medium text-neutral-600 transition-all duration-150`}
    >
      <div className="font flex items-center transition">
        <span className="text-base">Event Details</span>
        <span className="ml-auto flex items-center gap-[6px] text-black">
          <button className="cursor-pointer text-base">
            <BsThreeDotsVertical />
          </button>
          <button
            onClick={() => {
              setSelectedEvent(null);
            }}
            className="cursor-pointer text-xl"
          >
            <RxCross2 />
          </button>
        </span>
      </div>
      <div>
        <div className="relative flex h-5 w-full items-center">
          <div className="w-full border-t border-neutral-300"></div>
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white px-2 text-sm text-neutral-600">
            August 11
          </h1>
        </div>
        {selectedEvent && <EventCard event={selectedEvent} />}
      </div>

      <div className="flex items-center justify-between">
        <p>Priority</p>
        <Select
          defaultValue={selectedEvent?.color}
          onValueChange={(value) => setSelectedColor(value)}
        >
          <SelectTrigger className="h-7 w-14 border-none p-0 focus:ring-0">
            <div
              className="h-7 w-7"
              style={{ backgroundColor: selectedColor }}
            ></div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Colors</SelectLabel>
              {colors.map((color: any, i) => (
                <SelectItem value={color?.color} key={color?.color}>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="h-7 w-7"
                      style={{ backgroundColor: color?.color }}
                    ></div>
                    <span>{color?.priority}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3>Description</h3>
        <p className="text-base font-normal text-neutral-500 ">
          {selectedEvent?.description}
        </p>
      </div>

      <div>
        <h3>Notes</h3>
        <p className="text-base font-normal text-neutral-500 ">
          {selectedEvent?.notes}
        </p>
      </div>
      <div>
        <h3>Location</h3>
        <p className="text-base font-normal text-neutral-500 ">
          {selectedEvent?.location}
        </p>
      </div>
    </section>
  );
}
