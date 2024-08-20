import React, { useState } from "react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

export default function DatePicker({
  value,
  handleValueChange,
  align = "bottom",
  name,
}: {
  value: Date | null;
  handleValueChange: (e: any) => void;
  name: string;
  align?: string;
}) {
  // console.log('date', new Date())
  // const [date, setDate] = useState<Date|null>(null);
  const [displayCal, setDisplayCal] = useState<boolean>(false);

  let alignmentStyle = "";
  switch (align) {
    case "top":
      alignmentStyle = "bottom-full ";
      break;
    case "bottom":
      alignmentStyle = "top-full";
      break;
    case "left":
      alignmentStyle = "right-full transform -translate-y-1/2";
      break;
    case "right":
      alignmentStyle = "left-full transform -translate-y-1/2";
      break;
    default:
      alignmentStyle = "bottom-full";
  }

  return (
    <>
      <div className="relative w-full ">
        <input
          type="text"
          className="mb-2 h-10 w-full rounded border-[1px] border-neutral-300 px-4 text-base text-neutral-900 focus:border-primary-600"
          name={name || ""}
          value={value ? format(value, "EEEE, dd MMMM") : ""}
          onClick={() => setDisplayCal(true)}
          readOnly
        />

        <Calendar
          className={`${
            displayCal ? "block" : "hidden"
          } absolute ${alignmentStyle} z-20 w-fit rounded-md border bg-white`}
          mode="single"
          selected={value || new Date()}
          onSelect={(val) => {
            console.log("val;lllllllllllllllllllllllllllll:::", val);
            handleValueChange({ target: { name, value: val } });
          }}
        />
      </div>
      <div
        onClick={() => setDisplayCal(false)}
        className={`${
          displayCal ? "block" : "hidden"
        } absolute left-0 top-0 z-10 h-[400%] w-[1000px]`}
      ></div>
    </>
  );
}
