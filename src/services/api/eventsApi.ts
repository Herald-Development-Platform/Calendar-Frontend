import { getCookie } from "@/hooks/CookieHooks";
import { Axios, baseUrl } from "../baseUrl";
import Cookies from "js-cookie";
import Endpoints from "../API_ENDPOINTS";

export const getEvents = () => Axios.get(Endpoints.event);

export const postEvents = (payload: any) =>
  Axios.post(Endpoints.event, payload);
