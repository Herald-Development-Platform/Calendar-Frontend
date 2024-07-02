import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "../baseUrl";
import Endpoints from "../API_ENDPOINTS";
import { updateEvents } from "./eventsApi";
import toast from "react-hot-toast";

export const useGetEventByQuery = (queryParams: eventByParamsType) =>
  useQuery({
    queryKey: ["Events"],
    queryFn: async () => {
      try {
        const res = await Axios.get(
          Endpoints.eventByQuery({
            q: queryParams.q,
            departments: queryParams.departments,
            colors: queryParams.colors,
            eventTo: queryParams.eventTo,
            eventFrom: queryParams.eventFrom,
          }),
        );
        if (res.statusText !== "OK") {
          toast.error(res.data.message);
          return res.data;
        }
        return res.data.data;
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "something went wrong");
      }
    },
  });

export const useUpdateEvents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => {
      return Axios.put(Endpoints.eventById(payload.id), payload.newEvent);
    },
    onSuccess: async () => {
      console.log("response after updating");
      queryClient.invalidateQueries({ queryKey: ["Events"] });
    },
    onError: (err) => {
      toast.error("Something went wrong.");
      console.error("error here");
    },
  });
};
