import { useMutation, useQuery } from "@tanstack/react-query";
import { Axios } from "../baseUrl";
import Endpoints from "../API_ENDPOINTS";
import toast from "react-hot-toast";
0.3;
export const useCreateSemesters = (
  onSuccess: () => void = () => {
    toast.success("Semester created successfully");
  }
) =>
  useMutation({
    mutationKey: ["semesters"],
    mutationFn: async (data: Semester) => {
      return Axios.post(Endpoints.semester, data);
    },
    onSuccess,
  });

export const useGetSemesters = () => {
  return useQuery({
    queryKey: ["semesters"],
    queryFn: async () => {
      return Axios.get(`${Endpoints.semester}`);
    },
  });
};

export const useDeleteSemester = ({
  onSuccess = () => {
    toast.success("Semester deleted successfully");
  },
}: {
  onSuccess?: () => void;
}) => {
  return useMutation({
    mutationKey: ["semesters"],
    mutationFn: async (id: string) => {
      return Axios.delete(`${Endpoints.semester}/${id}`);
    },
    onSuccess,
  });
};

export const useUpdateSemester = ({
  onSuccess = () => {
    toast.success("Semester updated successfully");
  },
}: {
  onSuccess?: () => void;
}) => {
  return useMutation({
    mutationKey: ["semesters"],
    mutationFn: async (data: Semester) => {
      return Axios.put(`${Endpoints.semester}/${data._id}`, data);
    },
    onSuccess,
  });
};
