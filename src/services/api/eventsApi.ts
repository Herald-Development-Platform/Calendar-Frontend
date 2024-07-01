import { DEPARTMENTS } from "@/constants/departments";
import { getCookie } from "@/hooks/CookieHooks";
import { Axios, baseUrl } from "../baseUrl";
import Cookies from "js-cookie";
import Endpoints from "../API_ENDPOINTS";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RecurringEventTypes } from "@/constants/RecurringEvents";
import { Dispatch, SetStateAction } from "react";

export const getEvents = () => Axios.get(Endpoints.event);
export const getEventsByParams = (payload: eventByParamsType) =>
  Axios.get(
    Endpoints.eventByQuery({
      q: payload.q,
      departments: payload.departments,
      colors: payload.colors,
      eventFrom: "",
      eventTo: "",
    }),
  );
export const postEvents = (payload: any) =>
  Axios.post(Endpoints.event, payload);

export const updateEvents = (payload: any) => {
  return Axios.put(Endpoints.eventById(payload.id), payload.newEvent);
};
export const updateUser = (payload: any) =>
  Axios.put(Endpoints.updateUser(payload), payload);

export const useGetEvents = () =>
  useQuery({
    queryKey: ["Events"],
    queryFn: getEvents,
  });

export const useDeleteEvent = ({
  onSuccessFn,
}: {
  onSuccessFn?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string }) => {
      const axiosRes = await Axios.delete(Endpoints.eventById(payload.id));
      return axiosRes.data;
    },
    onSuccess: (res) => {
      console.log("res", res);
      toast.success(res.data.message || "Successfuly Deleted Event");
      queryClient.invalidateQueries({ queryKey: ["Events"] });
      // onSuccessFn && onSuccessFn();
    },
  });
};

export const usePostEventMutation = ({
  setNewEvent,
}: {
  setNewEvent?: Dispatch<SetStateAction<eventType>>;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postEvents,
    onSuccess: (res) => {
      console.log("Onsuccess", res);
      queryClient.invalidateQueries({ queryKey: ["Events"] });

      toast.success(`${res?.data?.message}`);

      setNewEvent &&
        setNewEvent({
          title: "",
          start: null,
          end: null,
          color: undefined,
          duration: 0,
          recurringType: RecurringEventTypes.ONCE,
          location: "",
          description: "",
          departments: [],
          notes: "",
          involvedUsers: [],
        });
    },
    onError: (err: any) => {
      console.log("error", err);
      toast.error(err?.data?.message || "something went wrong");
    },
  });
};
