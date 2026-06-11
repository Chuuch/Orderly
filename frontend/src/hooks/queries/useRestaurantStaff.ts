import { staffApi } from "@/api/staff.api";
import { useAuth } from "@/hooks/useAuth";
import { isRestaurantAdmin } from "@/lib/roles";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { useQuery } from "@tanstack/react-query";

export function useRestaurantStaff() {
    const { data: currentUser } = useCurrentUser();
    const enabled = isRestaurantAdmin(currentUser?.roles);

    return useQuery({
        queryKey: ["restaurant-staff"],
        queryFn: staffApi.list,
        enabled,
    });
}