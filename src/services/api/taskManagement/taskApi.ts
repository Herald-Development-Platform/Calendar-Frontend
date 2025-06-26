import { Axios } from "@/services/baseUrl";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: async (data: { title: string; column: string }) => {
      const response = await Axios.post("/task-management/tasks", data);
      return response.data;
    },
  });
};

export const useGetTaskByColumn = (columnId: string) => {
  return useQuery({
    queryKey: ["tasks", columnId],
    queryFn: async () => {
      const response = await Axios.get(
        `/task-management/tasks/column/${columnId}`,
      );
      return response.data;
    },
    enabled: !!columnId, // Only run if columnId is defined
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
