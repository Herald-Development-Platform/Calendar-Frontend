import { Axios } from "@/services/baseUrl";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateColumn = () => {
  return useMutation({
    mutationFn: async (title: string) => {
      const response = await Axios.post("/task-management/columns", { title });
      return response.data;
    },
  });
};

export const useGetColumns = () => {
  return useQuery({
    queryKey: ["columns"],
    queryFn: async () => {
      const response = await Axios.get("/task-management/columns");
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
