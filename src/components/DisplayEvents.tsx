import React from "react";

export default function DisplayEvents() {
  return (
    // <div className="relative flex h-5 w-full items-center justify-center">
    //   <h1 className="absolute left-1/2 -translate-x-1/2 transform bg-primary-50">
    //     August 18
    //   </h1>
    //   <span className="h-0 w-full -translate-y-1/2 border-[0.5px] border-black"></span>
    // </div>

    // <div className="h-0 w-full -translate-y-1/2 border-[0.5px] border-black">
    //   <h1 className="absolute left-1/2 -translate-x-1/2 transform bg-primary-50">
    //     August 18
    //   </h1>
    // </div>

    // <div className="relative flex h-auto flex-col justify-center">
    //   <div className="relative flex justify-center border-t">
    //     <span className="relative -top-1/2 bg-white px-2">August 18</span>
    //   </div>
    // </div>
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
      >
        <h1 className=" font-medium">Devcorps Meeting</h1>
        <p className="text-sm font-medium text-neutral-600">
          04:00 pm - 06:00 pm
        </p>
      </div>
    </div>
  );
}
