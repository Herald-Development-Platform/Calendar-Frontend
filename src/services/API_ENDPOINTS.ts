import { baseUrl } from "./baseUrl";

const Endpoints = {
  login: "/login",
  signup: "/signup",
  admin: "/admin/login",
  oauth: `${baseUrl}/googleAuth`,
  event: `/event`,
  eventById: (id: string) => `/event/${id}`,
  updateUser: (payload: any) => `/user/${payload.id}`,
  eventByQuery: ({
    q,
    departments,
    colors,
    eventTo,
    eventFrom,
  }: eventByParamsType) => {
    // console.log("eventTo", eventTo, "eventFrom", eventFrom);
    const departmentsSearchParam = departments
      .filter((dept) => dept.trim() !== "")
      .reduce((last, current) => (last ? last + "," + current : current), "");

    const colorsSearchParam = colors
      .filter((color) => color.trim() !== "")
      .map((color) => color.replace(/^#/, ""))
      .reduce((last, current) => (last ? last + "," + current : current), "");

    console.log(
      "event?q=${query}&departments",
      `/event?q=${q}&departments=${departmentsSearchParam}&colors=${colorsSearchParam}&eventFrom=${eventFrom}&eventTo=${eventTo}`,
    );
    return `/event?q=${q}&departments=${departmentsSearchParam}&colors=${colorsSearchParam}&eventFrom=${eventFrom}&eventTo=${eventTo}`;
  },
  profile: `/profile/all`,
  department: "/department",
  departmentById: (id: string) => `/department/${id}`,
};

export default Endpoints;
