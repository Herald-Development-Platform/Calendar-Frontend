import { Axios } from "@/services/baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateColumn = () => {
  return useMutation({
    mutationFn: async ({ columnId, title }: { columnId: string; title: string }) => {
      const response = await Axios.put(`/task-management/columns/${columnId}`, { title });
      return response.data;
    },
  });
}

export const useDeleteColumn = () => {
  return useMutation({
    mutationFn: async (columnId: string) => {
      const response = await Axios.delete(`/task-management/columns/${columnId}`);
      return response.data;
    },
  });
};