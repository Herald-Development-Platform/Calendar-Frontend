import { DEPARTMENTS } from "@/constants/departments";
import { getCookie } from "@/hooks/CookieHooks";
import { Axios, baseUrl } from "../baseUrl";
import Cookies from "js-cookie";
import Endpoints from "../API_ENDPOINTS";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface eventByParamsType {
  q: string;
  departments: string[];
}

export const getDepartments = () => Axios.get(Endpoints.department);
// export const getEventsByParams = (payload: eventByParamsType) =>
//   Axios.get(
//     Endpoints.eventByQuery({
//       query: payload.q,
//       departments: payload.departments,

//     }),
//   );

export const postEvents = (payload: any) =>
  Axios.post(Endpoints.event, payload);

export const postDepartment = (payload: any) =>
  Axios.post(Endpoints.department, payload);

export const updateUser = (payload: any) =>
  Axios.put(Endpoints.updateUser(payload), payload);

export const useGetDepartments = () =>
  useQuery({
    queryKey: ["Departments"],
    queryFn: async () => {
      try {
        const res = await Axios.get(Endpoints.department);
        return res.data.data;
      } catch (err) {
        toast.error("Something went wrong when fetching departments.", {
          duration: 10000,
        });
      }
    },
  });
