"use client";
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
import { CgArrowsExpandRight } from "react-icons/cg";
import { BsThreeDotsVertical } from "react-icons/bs";

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
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import EditEventModal from "@/components/AddEventModal/EditEventModal";
import { useQueryClient } from "@tanstack/react-query";
import { format, set } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddEventModal from "@/components/AddEventModal";
import EventModal from "@/components/AddEventModal/EventModal";
import RecurrenceType from "@/components/AddEventModal/RecurrenceType";
import { RecurringEventTypes } from "@/constants/RecurringEvents";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";
import { useEditEventMutation } from "@/services/api/eventsApi";
import { convertToLink } from "@/lib/utils";
import { FaCircleUser } from "react-icons/fa6";
export default function EventDetails({
  selectedEvent,
  setSelectedEvent,
  updateEvent,
  width,
  handleDelete,
}: {
  selectedEvent: eventType | null;
  setSelectedEvent: Dispatch<SetStateAction<eventType | null>>;
  updateEvent: any;
  width: number | null;
  handleDelete: (e: any) => void;
}) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    selectedEvent?.color,
  );
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [dropDown2, setDropDown2] = useState<boolean>(false);
  const [expandDetails, setExpandDetails] = useState<boolean>(false);
  const [recurringDialogOpen, setRecurringDialogOpen] =
    useState<boolean>(false);
  const [deleteType, setDeleteType] = useState<string>("all");

  const queryClient = useQueryClient();

  useEffect(() => {
    setSelectedColor(selectedEvent?.color);
  }, [selectedEvent]);

  const { mutate: updateEventDetail } = useEditEventMutation();

  return (
    <>
      <Dialog open={recurringDialogOpen} onOpenChange={setRecurringDialogOpen}>
        <DialogContent className="w-80">
          <DialogHeader>
            <h3 className="text-lg font-bold">Delete Recurring Event</h3>
          </DialogHeader>
          <RadioGroup
            defaultValue={deleteType}
            onValueChange={(value) => {
              setDeleteType(value);
            }}
          >
            <div className="flex items-center gap-3 space-x-2">
              <RadioGroupItem value="all" id="all" />
              <label htmlFor="all">Delete All Events</label>
            </div>
            <div className="flex items-center gap-3 space-x-2">
              <RadioGroupItem value="this" id="this" />
              <label htmlFor="this">Delete Only This</label>
            </div>
            <div className="flex items-center gap-3 space-x-2">
              <RadioGroupItem value="following" id="following" />
              <label htmlFor="following">Delete All Following</label>
            </div>
          </RadioGroup>
          <DialogFooter>
            <button
              onClick={async () => {
                if (deleteType === "all") {
                  handleDelete({
                    target: {
                      value:
                        selectedEvent?._id ||
                        // @ts-ignore
                        selectedEvent?.id,
                    },
                  });
                  setRecurringDialogOpen(false);
                  setExpandDetails(false);
                  setSelectedEvent(null);
                  queryClient.invalidateQueries({
                    queryKey: ["Events"],
                  });
                  return;
                }
                // handle exception ranges
                let exceptionStart, exceptionEnd;
                if (deleteType === "this") {
                  exceptionStart = new Date(
                    new Date(selectedEvent?.start ?? "").getTime() -
                      60000 -
                      5 * 60 * 60 * 1000 -
                      45 * 60 * 1000,
                  );
                  exceptionEnd = new Date(
                    new Date(selectedEvent?.end ?? "").getTime() +
                      60000 -
                      5 * 60 * 60 * 1000 -
                      45 * 60 * 1000,
                  );
                } else if (deleteType === "following") {
                  exceptionStart = new Date(
                    new Date(selectedEvent?.start ?? "").getTime() -
                      60000 -
                      5 * 60 * 60 * 1000 -
                      45 * 60 * 1000,
                  );
                  exceptionEnd = new Date(
                    new Date(selectedEvent?.recurrenceEnd ?? "").getTime() +
                      60000 -
                      5 * 60 * 60 * 1000 -
                      45 * 60 * 1000,
                  );
                }
                console.log("SELECTED EVENT::::", selectedEvent);
                console.log("EXCEPTION START::::", exceptionStart);
                console.log("EXCEPTION END::::", exceptionEnd);
                let newEvent = {
                  ...selectedEvent,
                  exceptionRanges: [
                    ...(selectedEvent?.exceptionRanges ?? []),
                    {
                      start: exceptionStart,
                      end: exceptionEnd,
                    },
                  ],
                };
                delete newEvent.start;
                delete newEvent.end;
                updateEventDetail(newEvent, {
                  onSuccess: () => {
                    setRecurringDialogOpen(false);
                    setExpandDetails(false);
                    setSelectedEvent(null);
                    queryClient.invalidateQueries({
                      queryKey: ["Events"],
                    });
                  },
                });
              }}
              className=" rounded-md bg-neutral-300 p-3 py-1.5 text-sm font-medium text-neutral-900"
            >
              OK
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section
        className={`${
          selectedEvent ? "" : "translate-x-full"
        } fixed bottom-0 right-0 z-20 flex h-[85%] w-80 flex-col gap-6 overflow-y-auto bg-white p-6 pl-1 font-medium text-neutral-600 transition-all duration-150`}
        style={{ width: `${width}px` }}
      >
        <div className="font flex items-center transition">
          <span className="text-base font-semibold">Event Details</span>
          <span className="ml-auto flex items-center gap-[6px] text-black">
            <button
              className="text-base"
              onClick={() => setExpandDetails(true)}
            >
              <CgArrowsExpandRight />
            </button>

            <DropdownMenu open={dropDown} onOpenChange={setDropDown}>
              <DropdownMenuTrigger>
                <button className="cursor-pointer text-base">
                  <BsThreeDotsVertical />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="h-[115px] w-[300px] px-5 py-4 text-sm font-semibold">
                <button
                  onClick={(e: any) => {
                    const modal_4 = document.getElementById(
                      "my_modal_4",
                    ) as HTMLDialogElement;
                    console.log("modal elemenet", modal_4);
                    modal_4.showModal();
                    // setDropDown(false);
                  }}
                  className="flex w-full items-center justify-start gap-2 px-2 py-1 text-neutral-700 transition-colors duration-150 hover:bg-neutral-100  hover:text-neutral-800"
                >
                  <span className="text-2xl">
                    <MdOutlineModeEditOutline />
                  </span>
                  Edit Event
                  <span>
                    {selectedEvent && (
                      <EditEventModal
                        defaultData={selectedEvent}
                      ></EditEventModal>
                    )}
                  </span>
                </button>
                <DropdownMenuSeparator />
                <button
                  onClick={(e: any) => {
                    setDropDown(false);

                    if (
                      selectedEvent?.recurringType === RecurringEventTypes.ONCE
                    ) {
                      setTimeout(() => {
                        handleDelete(e);
                        setSelectedEvent(null);
                      }, 200);
                    } else {
                      setRecurringDialogOpen(true);
                    }
                  }}
                  className="flex w-full items-center justify-start gap-2 px-2 py-1 text-danger-400 transition-colors duration-150 hover:bg-neutral-100  hover:text-danger-500"
                  value={selectedEvent?._id}
                >
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
          <div className="relative mb-3 flex h-5 w-full items-center">
            <div className="w-full border-t border-neutral-300"></div>
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white px-2 text-sm text-neutral-600">
              {selectedEvent?.start &&
                (new Date(selectedEvent.start).getDate() !==
                new Date(selectedEvent.end ?? "").getDate()
                  ? `${format(
                      new Date(selectedEvent?.start),
                      "MMM d",
                    )} - ${format(new Date(selectedEvent?.end ?? ""), "MMM d")}`
                  : format(new Date(selectedEvent?.start), "MMMM d"))}
            </h1>
          </div>
          {selectedEvent && <EventCard event={selectedEvent} />}
        </div>

        <div className="flex items-center justify-between">
          <p>Priority</p>
          <Select
            defaultValue={selectedEvent?.color}
            onValueChange={(value) => {
              updateEvent(
                {
                  id: selectedEvent?._id,
                  newEvent: { ...selectedEvent, color: value },
                },
                { onSuccess: () => {} },
              );
              setSelectedColor(value);
            }}
          >
            <SelectTrigger
              style={{
                backgroundColor: selectedEvent?.color,
              }}
              className="h-fit w-fit gap-2 border-none p-0 px-4 py-1.5 text-sm leading-none text-white focus:ring-0"
            >
              {
                colors.find((color) => color.color === selectedEvent?.color)
                  ?.priority
              }
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Colors</SelectLabel>
                {colors.map((color: any, i) => (
                  <SelectItem value={color?.color} key={color?.color}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-7 w-7 rounded-md"
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
          <div
            dangerouslySetInnerHTML={{
              __html: selectedEvent?.description
                ? new DOMParser().parseFromString(
                    convertToLink(selectedEvent?.description ?? "").replaceAll(
                      /<\s*script\s*>/gi,
                      "<p>",
                    ),
                    "text/html",
                  ).body.innerHTML
                : selectedEvent?.description || "",
            }}
            className="text-base font-normal text-neutral-500 "
          ></div>
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
        {selectedEvent?.createdBy && (
          <div className="flex flex-col gap-2">
            <h3>Author</h3>
            <div className="flex w-full items-center justify-start gap-2">
              {selectedEvent?.createdBy?.photo ? (
                <img
                  src={selectedEvent?.createdBy.photo}
                  alt={`Photo of ${selectedEvent?.createdBy?.username}`}
                  className=" w-6 rounded-full"
                />
              ) : (
                <span className="text-2xl text-neutral-500">
                  <FaCircleUser />
                </span>
              )}
              <span className="text-base font-normal text-neutral-500 ">
                {selectedEvent?.createdBy?.username}
              </span>
            </div>
          </div>
        )}
      </section>
      <div
        className={`${
          selectedEvent ? "block" : "hidden"
        } fixed left-0 top-0 z-10 h-full w-full bg-neutral-900 opacity-0`}
        onClick={() => setSelectedEvent(null)}
      ></div>

      <Dialog open={expandDetails} onOpenChange={setExpandDetails}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
        <DialogContent className="min-w-[60%]">
          <DialogHeader className="flex w-full flex-row justify-between ">
            <DialogTitle className="flex w-fit  text-lg font-medium">
              Event Details
            </DialogTitle>
            <span className="flex w-fit text-lg">
              <DropdownMenu open={dropDown2} onOpenChange={setDropDown2}>
                <DropdownMenuTrigger>
                  <button className="cursor-pointer text-base">
                    <BsThreeDotsVertical />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="h-[115px] w-[300px] px-5 py-4 text-sm font-semibold">
                  <button
                    onClick={(e: any) => {
                      const modal_4 = document.getElementById(
                        "my_modal_4",
                      ) as HTMLDialogElement;
                      console.log("modal elemenet", modal_4);
                      modal_4.showModal();
                      // setDropDown(false);
                    }}
                    className="flex w-full items-center justify-start gap-2 px-2 py-1 text-neutral-700 transition-colors duration-150 hover:bg-neutral-100  hover:text-neutral-800"
                  >
                    <span className="text-2xl">
                      <MdOutlineModeEditOutline />
                    </span>
                    Edit Event
                    <span>
                      {selectedEvent && (
                        <EditEventModal
                          defaultData={selectedEvent}
                          onEdit={() => {
                            setSelectedEvent(null);
                          }}
                        ></EditEventModal>
                      )}
                    </span>
                  </button>
                  <DropdownMenuSeparator />
                  <button
                    onClick={(e: any) => {
                      setDropDown(false);

                      if (
                        selectedEvent?.recurringType ===
                        RecurringEventTypes.ONCE
                      ) {
                        setTimeout(() => {
                          handleDelete(e);
                          setSelectedEvent(null);
                          setExpandDetails(false);
                        }, 200);
                      } else {
                        setRecurringDialogOpen(true);
                      }
                    }}
                    className="flex w-full items-center justify-start gap-2 px-2 py-1 text-danger-400 transition-colors duration-150 hover:bg-neutral-100  hover:text-danger-500"
                    value={selectedEvent?._id}
                  >
                    <span className="text-2xl">
                      <RiDeleteBin6Line />
                    </span>
                    Delete Event
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>

              <button onClick={() => setExpandDetails(false)}>
                <RxCross2 />
              </button>
            </span>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <div>
              <div className="relative mb-3 flex h-5 w-full items-center">
                <div className="w-full border-t border-neutral-300"></div>
                <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white px-2 text-sm text-neutral-600">
                  {selectedEvent?.start &&
                    (new Date(selectedEvent.start).getDate() !==
                    new Date(selectedEvent.end ?? "").getDate()
                      ? `${format(
                          new Date(selectedEvent?.start),
                          "MMMM d",
                        )} - ${format(
                          new Date(selectedEvent?.end ?? ""),
                          "MMMM d",
                        )}`
                      : format(new Date(selectedEvent?.start), "MMMM d"))}
                </h1>
              </div>
              {selectedEvent && <EventCard event={selectedEvent} />}
            </div>
            <div className="flex w-5/12 items-center justify-between">
              <p>Priority</p>
              <Select
                defaultValue={selectedEvent?.color}
                onValueChange={(value) => {
                  updateEvent(
                    {
                      id: selectedEvent?._id,
                      newEvent: { ...selectedEvent, color: value },
                    },
                    { onSuccess: () => {} },
                  );
                  setSelectedColor(value);
                }}
              >
                <SelectTrigger
                  style={{
                    backgroundColor: selectedEvent?.color,
                  }}
                  className="h-fit w-fit gap-2 border-none p-0 px-4 py-1.5 text-sm leading-none text-white focus:ring-0"
                >
                  {
                    colors.find((color) => color.color === selectedEvent?.color)
                      ?.priority
                  }
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Colors</SelectLabel>
                    {colors.map((color: any, i) => (
                      <SelectItem value={color?.color} key={color?.color}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-7 w-7 rounded-md"
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
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedEvent?.description
                    ? new DOMParser().parseFromString(
                        selectedEvent?.description.replaceAll(
                          /<\s*script\s*>/gi,
                          "<p>",
                        ),
                        "text/html",
                      ).body.innerHTML
                    : selectedEvent?.description || "",
                }}
                className="text-base font-normal text-neutral-500 "
              ></div>
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
