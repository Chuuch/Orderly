import { publicApi } from "@/api/public.api";
import type { ApiErrorResponse } from "@/types/api-error";
import type { OrderResponse } from "@/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCancelPublicOrder() {
    const queryClient = useQueryClient();

    return useMutation<OrderResponse, ApiErrorResponse, string>({
        mutationFn: (orderId) => publicApi.cancelOrder(orderId),
        onSuccess: (updated, orderId) => {
            queryClient.setQueryData(["public-order", orderId], updated);
        },
    });
}
