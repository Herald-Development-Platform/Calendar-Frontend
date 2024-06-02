import { baseUrl } from "./baseUrl";

const Endpoints = {
  login: "/login",
  signup: "/signup",
  admin: "/admin/login",
  oauth: `${baseUrl}/googleAuth`,
  event: "/event",
  eventById: (id: string) => `/event/${id}`,
};

export default Endpoints;
