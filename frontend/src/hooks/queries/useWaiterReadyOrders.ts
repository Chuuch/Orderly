import { ordersApi } from "@/api/orders.api";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export function useWaiterReadyOrders() {
    const { session } = useAuth();
    const restaurantId = session?.restaurantId;

    return useQuery({
        queryKey: ["waiter-ready-orders", restaurantId],
        queryFn: () => ordersApi.getOrdersByStatus(restaurantId!, "READY"),
        enabled: Boolean(restaurantId),
        refetchInterval: 10_000,
    });
}