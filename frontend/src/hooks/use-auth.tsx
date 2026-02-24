import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/apiRoutes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuthUser } from "@/types/auth";

export const useAuth = () => {
 return useQuery({
  queryKey: ["auth-user"],
  queryFn: async (): Promise<AuthUser> => {
    const response = await fetchWithAuth(apiRoutes.staffAuth.me, {
      method: "GET",
    });
    console.log("useAuth - API Response:", response);
    return response as AuthUser;
  },
  retry: false,
});
};