import React, { SetStateAction, useEffect, useState } from "react";

export function TimeSelector({
  date,
  setDateAndTime,
  type,
}: {
  date: Date | null;
  setDateAndTime: ({ hours, minutes, type }: setDateAndTimeTypes) => void;
  type: "start" | "end";
}) {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  useEffect(() => {
    setDateAndTime({ hours, minutes, type });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, minutes]);
  useEffect(() => {
    if (!date) return;
    setHours(new Date(date)?.getHours());
    setMinutes(new Date(date)?.getMinutes());
  }, [date]);

  return (
    <>
      <div className="flex h-auto w-full items-center rounded   text-base text-neutral-900">
        <div className="w-full rounded-lg  bg-white ">
          <div className="flex items-center justify-center">
            <select
              name="hours"
              className="appearance-none bg-transparent text-xl outline-none"
              onChange={e => {
                const hours = +e.target.value;
                setHours(hours);
              }}
              value={!date ? 0 : hours}
            >
              {[...Array(24)].map((_, index) => (
                <option key={index} value={index}>
                  {index < 10 ? "0" : ""}
                  {index}
                </option>
              ))}
            </select>

            <span className="mx-3 text-xl">:</span>

            <select
              name="minutes"
              className="mr-4 appearance-none bg-transparent text-xl outline-none"
              onChange={e => {
                const minutes = +e.target.value;
                setMinutes(minutes);
              }}
              value={!date ? 0 : minutes}
            >
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index * 5}>
                  {index * 5 < 10 ? "0" : ""}
                  {index * 5}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
