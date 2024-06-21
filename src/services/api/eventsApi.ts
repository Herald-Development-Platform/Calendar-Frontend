import { DEPARTMENTS } from "@/constants/departments";
import { getCookie } from "@/hooks/CookieHooks";
import { Axios, baseUrl } from "../baseUrl";
import Cookies from "js-cookie";
import Endpoints from "../API_ENDPOINTS";

export const getEvents = () => Axios.get(Endpoints.event);
export const getEventsByParams = (payload: eventByParamsType) =>
  Axios.get(
    Endpoints.eventByQuery({
      query: payload.q,
      departments: payload.departments,
      colors: payload.colors,
    }),
  );

export const postEvents = (payload: any) =>
  Axios.post(Endpoints.event, payload);

export const updateEvents = (payload: any) => {
  return Axios.put(Endpoints.eventById(payload.id), payload.newEvent);
};
export const updateUser = (payload: any) =>
  Axios.put(Endpoints.updateUser(payload), payload);
