import { ordersApi } from "@/api/orders.api";
import { useAuth } from "@/hooks/useAuth";
import type { ApiErrorResponse } from "@/types/api-error";
import type { OrderResponse, OrderStatus } from "@/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateStatusVariables = {
    orderId: string;
    status: OrderStatus;
};

export function useKitchenOrderActions() {
    const { session } = useAuth();
    const restaurantId = session?.restaurantId;
    const queryClient = useQueryClient();

    const invalidate = () => {
        if (restaurantId) {
            queryClient.invalidateQueries({ queryKey: ["kitchen-orders", restaurantId] });
        }
    };

    const confirm = useMutation<OrderResponse, ApiErrorResponse, string>({
        mutationFn: ordersApi.confirmOrder,
        onSuccess: invalidate,
    });

    const updateStatus = useMutation<OrderResponse, ApiErrorResponse, UpdateStatusVariables>({
        mutationFn: ({ orderId, status }) => ordersApi.updateOrderStatus(orderId, status),
        onSuccess: invalidate,
    });

    return { confirm, updateStatus };
}