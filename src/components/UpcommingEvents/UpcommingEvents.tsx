import React from "react";

export default function UpcommingEvents() {
  return (
    <div className="flex h-full w-1/3 flex-col gap-10 px-6">
      <div className="flex flex-col gap-1 text-neutral-600">
        <h2 className="font-semibold ">Upcomming Events</h2>
        <h3 className="text-lg">August 17 - August 23 </h3>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex h-5 w-full items-center">
          <div className="w-full border-t border-neutral-300  "></div>
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-white px-2 text-sm text-neutral-600">
            August 11
          </h1>
        </div>

        <div
          className="flex h-16 w-full flex-col gap-1 border-l-4 bg-opacity-10 px-4 py-2"
          style={{
            // opacity: "8%",
            backgroundColor: "rgba(151, 71, 255, 0.08)",
            borderWidth: "0 0 0 4px",
            borderColor: "#9747FF",
          }}
        ></div>
      </div>
    </div>
  );
}
