import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decryptJwtPayload(token: string) {
  console.log("decrypt jw", token);
  const jwtSections = token.split(".");

  return JSON.parse(atob(jwtSections[1]));
}
