import { useQuery } from "@tanstack/react-query";
import { Axios } from "../baseUrl";
import Endpoints from "../API_ENDPOINTS";
import toast from "react-hot-toast";

export const useGetSemester = () => {
  return useQuery<SemesterType[]>({
    queryKey: ["Semesters"],
    queryFn: async () => {
      try {
        const res = await Axios.get(Endpoints.semester);
        return res?.data?.data;
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Cannot fetch semesterdata.",
          {
            duration: 10 * 1000,
          },
        );
      }
    },
  });
};
