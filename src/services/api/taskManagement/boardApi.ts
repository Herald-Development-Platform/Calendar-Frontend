import { Axios } from "@/services/baseUrl";
import { TBoardFormData } from "@/types/taskmanagement/board.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: async (data: TBoardFormData) => {
      const response = await Axios.post("/task-management/boards", data);
      return response.data;
    },
  });
};

export const useGetBoards = () => {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await Axios.get("/task-management/boards/my");
      return response.data;
    },
  });
};
