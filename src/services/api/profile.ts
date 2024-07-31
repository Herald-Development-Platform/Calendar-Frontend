import { useMutation } from "@tanstack/react-query";
import { Axios } from "../baseUrl";
import Endpoints from "../API_ENDPOINTS";

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: (data: any) => {
      return Axios.patch(Endpoints.updateProfile, data);
    },
    mutationKey: ["updateProfile"],
  });
};
