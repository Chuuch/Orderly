import { userApi } from "@/api/user.api";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
    const { isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ["current-user"],
        queryFn: userApi.getMe,
        enabled: isAuthenticated,
    });
}