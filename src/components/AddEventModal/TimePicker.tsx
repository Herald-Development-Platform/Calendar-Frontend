import React, { useEffect } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { set } from "date-fns";
import toast from "react-hot-toast";

const TimePicker = ({
  dateType,
  value,
  handleTimeChange,
}: {
  dateType: string;
  value: Date | null;
  handleTimeChange: (e: any) => void;
}) => {
  const [selectedTime, setSelectedTime] = React.useState({
    hours: 0,
    minutes: 0,
    ampm: "AM",
  });

  useEffect(() => {
    if (value) {
      const hours = value.getHours();
      const minutes = value.getMinutes();
      setSelectedTime({
        hours,
        minutes,
        ampm: hours >= 12 ? "PM" : "AM",
      });
    }
  }, [value]);

  function handleTime(type: "hour" | "minute" | "ampm", value: string) {
    const newTime = new Date();
    let hours = selectedTime.hours;
    let minutes = selectedTime.minutes;
    let ampm = selectedTime.ampm;

    if (type === "hour") {
      hours = parseInt(value, 10);
      if (ampm === "PM" && hours < 12) {
        hours += 12;
      } else if (ampm === "AM" && hours === 12) {
        hours = 0;
      }
    } else if (type === "minute") {
      minutes = parseInt(value, 10);
    } else if (type === "ampm") {
      if (value === "AM" && ampm === "PM") {
        toast.success("AM");
        if (hours >= 12) hours -= 12;
      } else if (value === "PM" && ampm === "AM") {
        if (hours < 12) hours += 12;
      }
      ampm = value;
    }
    if (hours >= 12) {
      ampm = "PM";
    } else {
      ampm = "AM";
    }
    setSelectedTime({
      hours,
      minutes,
      ampm,
    });

    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    handleTimeChange({ target: { name: dateType, value: newTime } });
  }

  const handleNewTime = (e: any) => {
    const newTime = new Date();
    let time = e.target.value.split(":");

    let hours = parseInt(time[0]);
    let minutes = parseInt(time[1]);

    setSelectedTime({
      hours: parseInt(time[0]),
      minutes: parseInt(time[1]),
      ampm: parseInt(time[0]) >= 12 ? "PM" : "AM",
    });

    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    handleTimeChange({ target: { name: dateType, value: newTime } });
  };
  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <Button
          type="button"
          variant="outline"
          className="flex w-full flex-grow justify-center"
        >
          {(() => {
            let hours12 = selectedTime.hours % 12 || 12;
            return `${hours12.toString().padStart(2, "0")}:${selectedTime.minutes.toString().padStart(2, "0")} ${selectedTime.ampm}`;
          })()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-auto p-0">
        <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
          <ScrollArea className="max-h-[300px] w-64 overflow-y-auto sm:w-auto">
            <div className="flex p-2 sm:flex-col">
              {Array.from({ length: 12 }, (_, i) => i + 1)
                .reverse()
                .map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    value={hour}
                    variant={
                      selectedTime && selectedTime.hours % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTime("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
            </div>
            {/* <ScrollBar orientation="horizontal" className="sm:hidden"  /> */}
          </ScrollArea>
          <ScrollArea className="w-64 sm:w-auto">
            <div className="flex p-2 sm:flex-col">
              {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                <Button
                  key={minute}
                  size="icon"
                  variant={
                    selectedTime && selectedTime.minutes === minute
                      ? "default"
                      : "ghost"
                  }
                  className="aspect-square shrink-0 sm:w-full"
                  onClick={() => handleTime("minute", minute.toString())}
                >
                  {minute.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
          <ScrollArea className="">
            <div className="flex p-2 sm:flex-col">
              {["AM", "PM"].map((ampm) => (
                <Button
                  key={ampm}
                  size="icon"
                  variant={
                    selectedTime &&
                    ((ampm === "AM" && selectedTime.ampm === "AM") ||
                      (ampm === "PM" && selectedTime.ampm === "PM"))
                      ? "default"
                      : "ghost"
                  }
                  className="aspect-square shrink-0 sm:w-full"
                  onClick={() => handleTime("ampm", ampm)}
                >
                  {ampm}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>

    // <input type="time" onChange={handleNewTime}/>
  );
};

export default TimePicker;
