import { useQuery } from "@tanstack/react-query";
import { Axios } from "../baseUrl";
import Endpoints from "../API_ENDPOINTS";
import toast from "react-hot-toast";

export const useGetLocation = () => {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      try {
        const res = await Axios.get(Endpoints.location);

        return res?.data?.data;
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Cannot fetch locations.", {
          duration: 10 * 1000,
        });
      }
    },
  });
};
