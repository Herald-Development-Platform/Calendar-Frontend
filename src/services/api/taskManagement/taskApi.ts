import { Axios } from "@/services/baseUrl";
import { useMutation } from "@tanstack/react-query";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: async ( data: { title:string, column: string}) => {
        const response = await Axios.post("/task-management/tasks", data);
        return response.data;
    }
  });
};
