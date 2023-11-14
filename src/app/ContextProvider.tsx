"use client";

import { createContext, useState } from "react";

export const Context = createContext({});

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events, setEvents] = useState<eventType[]>([
    {
      title: "event1",
      start: new Date(),
      end: new Date(),
    },
  ]);
  console.log("context events", events);
  return (
    <Context.Provider value={{ events, setEvents }}>
      {children}
    </Context.Provider>
  );
}
