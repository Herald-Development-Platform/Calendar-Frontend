import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "../baseUrl";
import Endpoints from "../API_ENDPOINTS";
import { updateEvents } from "./eventsApi";
import toast from "react-hot-toast";

export const useGetEventByQuery = (queryParams: any) =>
  useQuery({
    queryKey: ["Events"],
    queryFn: () =>
      Axios.get(
        Endpoints.eventByQuery({
          query: queryParams.q,
          departments: queryParams.departments,
          colors: queryParams.colors,
        }),
      ),
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
