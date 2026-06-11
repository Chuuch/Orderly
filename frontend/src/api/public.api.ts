import type { QrScanContext } from "@/types/restaurant";
import { apiClient } from "./client";
import type { OrderResponse, PublicCreateOrderRequest } from "@/types/order";

export const publicApi = {
    getQrContext: (qrToken: string) =>
        apiClient
            .get<QrScanContext>(`/api/v1/public/tables/qr/${qrToken}/context`)
            .then((r) => r.data),
        
    placeOrder: (qrToken: string, body: PublicCreateOrderRequest) =>
        apiClient
            .post<OrderResponse>(`/api/v1/public/tables/qr/${qrToken}/orders`, body)
            .then((r) => r.data),

    getOrder: (orderId: string) =>
        apiClient
            .get<OrderResponse>(`/api/v1/public/orders/${orderId}`)
            .then((r) => r.data),
}