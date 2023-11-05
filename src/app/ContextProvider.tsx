"use client";

import { createContext } from "react";

export const Context = createContext({});

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Context.Provider value={"dark"}>{children}</Context.Provider>;
}
