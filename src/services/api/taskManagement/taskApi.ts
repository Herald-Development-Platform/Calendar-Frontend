import { Axios } from "@/services/baseUrl";
import { ITask } from "@/types/taskmanagement/task.types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateTask = () => {
  return useMutation({
    mutationFn: async (data: { title: string; column: string }) => {
      const response = await Axios.post("/task-management/tasks", data);
      return response.data;
    },
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: async  ( data: ITask) =>{
      const response = await Axios.put(`/task-management/tasks/${data._id}`, data);
      return response.data;
    }
  })
}

export const useGetAllTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await Axios.get("/task-management/tasks");
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

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


export const useGetArchivedTasks = () => {
  return useQuery({
    queryKey: ["archived-tasks"],
    queryFn: async () => {
      const response = await Axios.get("/task-management/tasks/archive");
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await Axios.delete(`/task-management/tasks/${taskId}`);
      return response.data;
    },
  });
}