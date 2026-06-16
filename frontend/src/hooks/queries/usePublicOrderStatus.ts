import { publicApi } from "@/api/public.api";
import { isTerminalOrderStatus, ORDER_TRACKING_POLL_MS } from "@/lib/order-tracking-config";
import type { OrderResponse } from "@/types/order";
import { useQuery } from "@tanstack/react-query";

export function usePublicOrderStatus(orderId: string | undefined, initialOrder?: OrderResponse) {
    return useQuery({
        queryKey: ['public-order', orderId],
        queryFn: () => publicApi.getOrder(orderId!),
        enabled: Boolean(orderId),
        initialData: initialOrder,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            if (status && isTerminalOrderStatus(status)) {
                return false;
            }
            return ORDER_TRACKING_POLL_MS;
        }
    });
}