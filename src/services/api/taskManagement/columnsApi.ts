import { Axios } from "@/services/baseUrl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateColumn = () => {
  return useMutation({
    mutationFn: async (data: { title: string, board: string}) => {
      const response = await Axios.post("/task-management/columns", data);
      return response.data;
    },
  });
};

export const useGetColumns = (boardId: string) => {
  return useQuery({
    queryKey: ["columns", boardId],
    queryFn: async () => {
      const response = await Axios.get("/task-management/columns",{
        params: { board: boardId}
      });
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
};

export const useDeleteColumn = () => {
  return useMutation({
    mutationFn: async (columnId: string) => {
      const response = await Axios.delete(`/task-management/columns/${columnId}`);
      return response.data;
    },
  });
};
