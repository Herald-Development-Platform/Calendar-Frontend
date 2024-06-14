import { DEPARTMENTS } from "@/constants/departments";
import { getCookie } from "@/hooks/CookieHooks";
import { Axios, baseUrl } from "../baseUrl";
import Cookies from "js-cookie";
import Endpoints from "../API_ENDPOINTS";

interface eventByParamsType {
  q: string;
  departments: string[];
}

export const getEvents = () => Axios.get(Endpoints.event);
export const getEventsByParams = (payload: eventByParamsType) =>
  Axios.get(
    Endpoints.eventByQuery({
      query: payload.q,
      departments: payload.departments,
    }),
  );

export const postEvents = (payload: any) =>
  Axios.post(Endpoints.event, payload);

export const updateEvents = (payload: any) =>
  Axios.put(Endpoints.eventById(payload.id), payload.body);

export const updateUser = (payload: any) =>
  Axios.put(Endpoints.updateUser(payload), payload);
