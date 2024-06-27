import { CalendarApi } from "@fullcalendar/core/index.js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CalendarViews, ListViews } from "@/constants/CalendarViews";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decryptJwtPayload(token: string) {
  console.log("decrypt jw", token);
  const jwtSections = token.split(".");

  return JSON.parse(atob(jwtSections[1]));
}

export function findListView(calView: string, calendarApi: CalendarApi) {
  switch (calView) {
    case CalendarViews.multiMonthView:
      return calendarApi.changeView(ListViews.listViewYear);
    case CalendarViews.monthView:
      return calendarApi.changeView(ListViews.listViewMonth);
    case CalendarViews.weekView:
      return calendarApi.changeView(ListViews.listViewWeek);
    case CalendarViews.timeGrid.week:
      return calendarApi.changeView(ListViews.listViewWeek);
    case CalendarViews.timeGrid.day:
      return calendarApi.changeView(ListViews.listViewDay);
  }
}
export function findNormalView(calView: string, calendarApi: CalendarApi) {
  switch (calView) {
    case ListViews.listViewYear:
      return calendarApi.changeView(CalendarViews.multiMonthView);
    case ListViews.listViewMonth:
      return calendarApi.changeView(CalendarViews.monthView);
    case ListViews.listViewWeek:
      return calendarApi.changeView(CalendarViews.weekView);
    case ListViews.listViewWeek:
      return calendarApi.changeView(CalendarViews.timeGrid.week);
    case ListViews.listViewDay:
      return calendarApi.changeView(CalendarViews.timeGrid.day);
  }
}
export function checkListView(currentView: string | undefined): boolean {
  if (
    currentView === ListViews.listViewDay ||
    currentView === ListViews.listViewMonth ||
    currentView === ListViews.listViewWeek ||
    currentView === ListViews.listViewYear
  )
    return true;
  else return false;
}

export function makePascalCase(original_string: string) {
  let final_str = "";
  original_string.split(" ").forEach((str) => {
    final_str +=
      (str.length > 1
        ? str[0].toUpperCase() + str.toLowerCase().substr(1)
        : str.toUpperCase()) + " ";
  });
  console.log("finalstr", final_str);
  return final_str.trim();
}
