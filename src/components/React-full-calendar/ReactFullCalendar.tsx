import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Calendar from "@fullcalendar/core";

export default class DemoApp extends React.Component {
  render() {
    // const calendar = useRef();
    return (
      <div className="h-full w-full">
        <button
          onClick={() => {
            Calendar.Calendar;
          }}
        ></button>
        <FullCalendar
          ref={}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={[
            {
              title: "event1",
              start: new Date(),
            },
          ]}
          headerToolbar={{
            left: "prev,next,today title",
            center: "title",
            right: "",
          }}
        />
      </div>
    );
  }
}
