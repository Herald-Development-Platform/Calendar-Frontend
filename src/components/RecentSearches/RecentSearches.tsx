import React from "react";
import Image from "next/image";
export default function RecentSearches() {
  return (
    <div className="ml-8 flex w-1/2 flex-col gap-2">
      <p className="text-base text-neutral-500 ">Recent Searches</p>
      <div className="flex flex-col">
        <button className="flex h-14 items-center gap-3 rounded px-3 py-[6px] focus:bg-neutral-100 ">
          {/* img div */}
          <div className="flex items-center">
            <Image
              src={"/images/LoginPage/HeraldLogo.png"}
              alt="heraldlogo"
              width={"32"}
              height={"32"}
            />
          </div>

          {/* event heading & description */}
          <div className="flex flex-col items-start">
            <h1 className="text-base font-medium text-neutral-900">
              Devcorps Meeting
            </h1>
            <p className="text-sm text-neutral-600">Event</p>
          </div>
        </button>
        <button className="flex h-14 items-center gap-3 rounded px-3 py-[6px] focus:bg-neutral-100 ">
          {/* img div */}
          <div className="flex items-center">
            <Image
              src={"/images/LoginPage/HeraldLogo.png"}
              alt="heraldlogo"
              width={"32"}
              height={"32"}
            />
          </div>

          {/* event heading & description */}
          <div className="flex flex-col items-start">
            <h1 className="text-base font-medium text-neutral-900">
              Devcorps Meeting
            </h1>
            <p className="text-sm text-neutral-600">Event</p>
          </div>
        </button>
        <button className="flex h-14 items-center gap-3 rounded px-3 py-[6px] focus:bg-neutral-100 ">
          {/* img div */}
          <div className="flex items-center">
            <Image
              src={"/images/LoginPage/HeraldLogo.png"}
              alt="heraldlogo"
              width={"32"}
              height={"32"}
            />
          </div>

          {/* event heading & description */}
          <div className="flex flex-col items-start">
            <h1 className="text-base font-medium text-neutral-900">
              Devcorps Meeting
            </h1>
            <p className="text-sm text-neutral-600">Event</p>
          </div>
        </button>
        <button className="flex h-14 items-center gap-3 rounded px-3 py-[6px] focus:bg-neutral-100 ">
          {/* img div */}
          <div className="flex items-center">
            <Image
              src={"/images/LoginPage/HeraldLogo.png"}
              alt="heraldlogo"
              width={"32"}
              height={"32"}
            />
          </div>

          {/* event heading & description */}
          <div className="flex flex-col items-start">
            <h1 className="text-base font-medium text-neutral-900">
              Devcorps Meeting
            </h1>
            <p className="text-sm text-neutral-600">Event</p>
          </div>
        </button>
      </div>
    </div>
  );
}
