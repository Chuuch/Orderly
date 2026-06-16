import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { menuApi } from "@/api/menu.api";

export function useRestaurantMenus() {
    const { session } = useAuth();
    const restaurantId = session?.restaurantId;

    return useQuery({
        queryKey: ['restaurant-menus', restaurantId],
        queryFn: () => menuApi.getRestaurantMenus(restaurantId!),
        enabled: !!restaurantId,
    });
}