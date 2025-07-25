import { useMutation, useQuery } from "@tanstack/react-query";
import { Axios } from "../baseUrl";
import Endpoints from "../API_ENDPOINTS";
import { ROLES } from "@/constants/role";
import { generateNewToken } from "@/lib/utils";
import { setCookie } from "@/hooks/CookieHooks";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await Axios.get(`/profile`);
        const user = response.data.data;
        if (user) {
          if (user.syncWithGoogle && (user.role === ROLES.SUPER_ADMIN || user.department)) {
            syncWithGoogle();
          }
          const token = await generateNewToken();
          if (token) {
            setCookie("token", token, 5);
          }
        }
        return user;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return {};
      }
    },
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: (data: any) => {
      return Axios.patch(Endpoints.updateProfile, data);
    },
    mutationKey: ["updateProfile"],
  });
};
function syncWithGoogle() {
  throw new Error("Function not implemented.");
}
