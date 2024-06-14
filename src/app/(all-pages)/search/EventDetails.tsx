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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";

import colors from "@/constants/Colors";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddEventModal from "@/components/AddEventModal";
import EditEventModal from "@/components/AddEventModal/EditEventModal";

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
    console.log("selected", selectedEvent);
    setSelectedColor(selectedEvent?.color);
  }, [selectedEvent]);

  return (
    <>
      <section
        className={`${
          Boolean(selectedEvent) ? "" : "translate-x-full"
        } absolute right-0 top-0 flex h-auto w-80 flex-col  gap-6 p-6 font-medium text-neutral-600 transition-all duration-150`}
      >
        <div className="font flex items-center transition">
          <span className="text-base">Event Details</span>
          <span className="ml-auto flex items-center gap-[6px] text-black">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="cursor-pointer text-base">
                  <BsThreeDotsVertical />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="h-[115px] w-[300px] px-5 py-4 text-sm font-semibold">
                <button
                  onClick={(e: any) => {
                    // setTimeout(() => {
                    const modal_3 = document.getElementById(
                      "my_modal_3",
                    ) as HTMLDialogElement;
                    console.log("modal elemenet", modal_3);
                    modal_3.showModal();
                    // }, 1000);
                  }}
                  className="flex w-full items-center justify-start gap-2 px-2 py-1 text-neutral-700 transition-colors duration-150 hover:bg-neutral-100  hover:text-neutral-800"
                >
                  <span className="text-2xl">
                    <MdOutlineModeEditOutline />
                  </span>
                  Edit Event
                  <span className={`fixed left-full `}>
                    {Boolean(selectedEvent) && (
                      <EditEventModal
                        defaultData={selectedEvent}
                      ></EditEventModal>
                    )}
                  </span>
                </button>
                <DropdownMenuSeparator />
                <button className="flex w-full items-center justify-start gap-2 px-2 py-1 text-danger-400 transition-colors duration-150 hover:bg-neutral-100  hover:text-danger-500">
                  <span className="text-2xl">
                    <RiDeleteBin6Line />
                  </span>
                  Delete Event
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
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
    </>
  );
}
//  onClick={() => {
//           const modal_3 = document.getElementById(
//             "my_modal_3",
//           ) as HTMLDialogElement;
//           modal_3.showModal();
//         }}
