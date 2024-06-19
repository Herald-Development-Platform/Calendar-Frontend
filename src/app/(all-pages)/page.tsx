/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import "react-big-calendar/lib/sass/styles.scss";
import "react-datepicker/dist/react-datepicker.css";
import UpcommingEvents from "@/components/UpcommingEvents";
import * as Headers from "@/components/Header";
import ReactFullCalendar from "@/components/React-full-calendar";

export default function page() {


  return (
    <div className="flex h-full w-full flex-col gap-8">
      <div className="w-full">
        <Headers.HomeHeader />
      </div>

      <div className=" flex h-full w-full justify-between overflow-hidden overflow-y-auto">
        <ReactFullCalendar />
        <UpcommingEvents />
      </div>
    </div>
  );
}
