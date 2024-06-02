import { getCookie } from "@/hooks/CookieHooks";
import { Axios, baseUrl } from "../baseUrl";
import Cookies from "js-cookie";

export const getEvents = () => Axios.get("/event");

export const postEvents = (payload: any) => Axios.post("/event", payload);
