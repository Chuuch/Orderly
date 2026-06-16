import type { OrderResponse, OrderStatus } from "@/types/order";
import { apiClient } from "./client";

export const ordersApi = {
    getRecentOrders: (restaurantId: string) =>
        apiClient
            .get<OrderResponse[]>(`/api/v1/orders/restaurant/${restaurantId}/recent`)
            .then((r) => r.data),

    confirmOrder: (orderId: string) =>
        apiClient
            .post<OrderResponse>(`/api/v1/orders/${orderId}/confirm`)
            .then((r) => r.data),

    updateOrderStatus: (orderId: string, status: OrderStatus) =>
        apiClient
            .patch<OrderResponse>(`/api/v1/orders/${orderId}/status`, null, {
                params: { status },
            })
            .then((r) => r.data),
};