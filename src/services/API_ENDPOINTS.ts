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
    query,
    departments,
    colors,
  }: {
    query: string;
    departments: string[];
    colors: string[];
  }) => {
    const departmentsSearchParam = departments
      .filter((dept) => dept.trim() !== "")
      .reduce((last, current) => (last ? last + "," + current : current), "");

    const colorsSearchParam = colors
      .filter((color) => color.trim() !== "")
      .map((color) => color.replace(/^#/, ""))
      .reduce((last, current) => (last ? last + "," + current : current), "");

    console.log(
      "event?q=${query}&departments",
      `/event?q=${query}&departments=${departmentsSearchParam}&colors=${colorsSearchParam}`,
    );
    return `/event?q=${query}&departments=${departmentsSearchParam}&colors=${colorsSearchParam}`;
  },
  profile: `/profile/all`,
  department: "/department",
  departmentById: (id: string) => `/department/${id}`,
};

export default Endpoints;
