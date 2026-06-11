import { tablesApi } from "@/api/tables.api";
import { useAuth } from "../useAuth";
import { useQuery } from "@tanstack/react-query";

export function useRestaurantTables() {
    const { session } = useAuth();
    const restaurantId = session?.restaurantId;

    return useQuery({
        queryKey: ["restaurant-tables", restaurantId],
        queryFn: () => tablesApi.getRestaurantTables(restaurantId!),
        enabled: Boolean(restaurantId),
    });
}