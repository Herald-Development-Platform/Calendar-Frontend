import { baseUrl } from "./baseUrl";

const Endpoints = {
  login: "/login",
  signup: "/signup",
  admin: "/admin/login",
  oauth: `${baseUrl}/googleAuth`,
  event: `/event`,
  updateUser: (payload: any) => `/user/${payload.id}`,
  eventByQuery: ({
    query,
    departments,
  }: {
    query: string;
    departments: string[];
  }) => {
    const departmentsSearchParam = departments.reduce(
      (last, current) => last + "," + current,
    );
    console.log("departmentsSearchParam", departmentsSearchParam);
    return `/event?q=${query}&departments=${departmentsSearchParam}`;
  },
  eventById: (id: string) => `/event/${id}`,
  department: "/department",
};

export default Endpoints;
