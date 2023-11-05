import React from "react";
import DisplayEvents from "./DisplayEvents";
export default function UpcommingEvents() {
  return (
    <div
      // className="absolute right-0 flex h-full w-9 flex-col gap-10 p-6"
      className="flex h-full w-1/3 flex-col gap-10 p-6"
    >
      <div className="flex flex-col gap-1 text-neutral-600">
        <h2 className="font-semibold ">Upcomming Events</h2>
        <h3 className="text-lg">August 17 - August 23 </h3>
      </div>

      <DisplayEvents />
    </div>
  );
}
