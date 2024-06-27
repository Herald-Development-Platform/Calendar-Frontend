import React, { useState } from "react";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

export default function CustomTimePicker({
  type,
  value,
  handleTimeChange,
}: {
  type: string;
  value: Date | null;
  handleTimeChange: (e: any) => void;
}) {
  const [showTimePicker, setShowTimePicker] = useState<boolean>();
  // const [date, setDate] = useState<any>(new Date());

  console.log(
    "customtimepicker",
    value ? new Date(value).getTime() : "no value",
  );
  return (
    <>
      <div className="relative flex-grow">
        <label htmlFor={`pickTime-${type}`}>
          <input
            name=""
            className="z-0 h-10 w-full rounded border-[1px] border-neutral-300 px-2 text-center text-neutral-900 focus:border-primary-600"
            id={`pickTime-${type}`}
            type="text"
            onFocus={() => setShowTimePicker(true)}
            value={value ? format(value, "hh : mm  a") : "00 : 00 "}
          />
        </label>

        <StaticTimePicker
          className={`${showTimePicker ? "inline-block" : "hidden"} ${
            type === "start" ? "left-0" : "right-0"
          } absolute top-12 z-20 rounded-sm `}
          value={value}
          onAccept={(value) => {
            if (!value) return;

            setShowTimePicker(false);
            handleTimeChange({
              target: { name: type, value: new Date(value) },
            });
          }}
        />
      </div>
      <div
        onClick={() => {
          setShowTimePicker(false);
        }}
        className={`${
          showTimePicker ? "block" : "hidden"
        }  absolute left-0  top-0 z-10 h-[300%] w-full bg-black bg-opacity-10`}
      ></div>
    </>
  );
}
