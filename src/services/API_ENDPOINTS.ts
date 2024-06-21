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
  profile: `/profile/all`,
  department: "/department",
  departmentById: (id: string) => `/department/${id}`,
};

export default Endpoints;
