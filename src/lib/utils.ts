import { CalendarApi } from "@fullcalendar/core/index.js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CalendarViews, ListViews } from "@/constants/CalendarViews";
import { Axios } from "@/services/baseUrl";
import { Dispatch, SetStateAction } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decryptJwtPayload(token: string) {
  const jwtSections = token.split(".");

  return JSON.parse(atob(jwtSections[1]));
}

export function findListView(
  calView: string,
  calendarApi: CalendarApi,
  setCurrentView: Dispatch<SetStateAction<string>>
) {
  switch (calView) {
    case CalendarViews.multiMonthView:
      return setCurrentView(ListViews.listViewYear);
    case CalendarViews.monthView:
      return setCurrentView(ListViews.listViewMonth);
    case CalendarViews.weekView:
      return setCurrentView(ListViews.listViewWeek);
    case CalendarViews.timeGrid.week:
      return setCurrentView(ListViews.listViewWeek);
    case CalendarViews.timeGrid.day:
      return setCurrentView(ListViews.listViewDay);
  }
}

export function findNormalView(
  calView: string,
  calendarApi: CalendarApi,
  setCurrentView: Dispatch<SetStateAction<string>>
) {
  switch (calView) {
    case ListViews.listViewYear:
      return setCurrentView(CalendarViews.multiMonthView);
    case ListViews.listViewMonth:
      return setCurrentView(CalendarViews.monthView);
    case ListViews.listViewWeek:
      return setCurrentView(CalendarViews.timeGrid.week);
    case ListViews.listViewDay:
      return setCurrentView(CalendarViews.timeGrid.day);
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
  original_string.split(" ").forEach(str => {
    final_str +=
      (str.length > 1 ? str[0].toUpperCase() + str.toLowerCase().substr(1) : str.toUpperCase()) +
      " ";
  });

  return final_str.trim();
}

export const generateNewToken = async () => {
  try {
    const response = await Axios.get("/generateNewToken");
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const linkRegex = new RegExp(
  /(?<!<a\s[^>]*?href=["'][^"'>]*)\b((https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(:\d+)?(\/\S*)?)\b(?![^<]*<\/a>)/gi
);

function addDescriptionLinkClass(htmlString: string): string {
  const tempDiv: HTMLDivElement = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  const anchors: HTMLCollectionOf<HTMLAnchorElement> = tempDiv.getElementsByTagName("a");

  Array.from(anchors).forEach((anchor: HTMLAnchorElement) => {
    anchor.style.color = "#4b6cc8";
    anchor.style.cursor = "pointer";
    anchor.style.textDecoration = "underline";
  });

  return tempDiv.innerHTML;
}

export function convertToLink(string: string) {
  string = addDescriptionLinkClass(string);
  return string.replace(linkRegex, (match: string) => {
    let url = match.startsWith("http") ? match : `http://${match}`;
    return `<a style="color:#4b6cc8;cursor:pointer;text-decoration:underline;" target="_blank" href="${url}">${match}</a>`;
  });
}

function generateRandomId(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
