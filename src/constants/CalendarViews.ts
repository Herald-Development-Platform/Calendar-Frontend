import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import timeGridPlugin from "@fullcalendar/timegrid";

export const CalendarViews = {
  multiMonthView: "multiMonthYear",
  weekView: "dayGridWeek",
  monthView: "dayGridMonth",
  timeGrid: {
    week: "timeGridWeek",
    day: "timeGridDay",
  },
};
export const ListViews = {
  listViewYear: "listYear",
  listViewMonth: "listMonth",
  listViewWeek: "listWeek",
  listViewDay: "listDay",
};
export const allPlugins = [
  dayGridPlugin,
  multiMonthPlugin,
  interactionPlugin,
  timeGridPlugin,
  listPlugin,
  multiMonthPlugin,
];
