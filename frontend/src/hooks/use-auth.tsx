import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/apiRoutes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuthUser } from "@/types/auth";

export const useAuth = () => {
  return useQuery<AuthUser>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const response = await fetchWithAuth(apiRoutes.staffAuth.me, {
        method: "GET",
      }) as { data: AuthUser };

      const user = response.data;

      return {
        ...user,
        role: user.role.toLowerCase(), 
      } as AuthUser;
    },
    retry: false,
  });
};