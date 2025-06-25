import { Axios } from "@/services/baseUrl";
import { useMutation } from "@tanstack/react-query";

export const useCreateColumn = () => {
  return useMutation({
    mutationFn: async (title: string) => {
      const response = await Axios.post("/task-management/columns", { title });
      return response.data;
    },
  });
};
