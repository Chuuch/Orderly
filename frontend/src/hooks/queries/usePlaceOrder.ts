import { publicApi } from "@/api/public.api";
import type { ApiErrorResponse } from "@/types/api-error";
import type { OrderResponse, PublicCreateOrderRequest } from "@/types/order";
import { useMutation } from "@tanstack/react-query";

type PlaceOrderVariables = {
    qrToken: string;
    body: PublicCreateOrderRequest;
};

export function usePlaceOrder() {
    return useMutation<OrderResponse, ApiErrorResponse, PlaceOrderVariables>({
        mutationFn: ({ qrToken, body }) => publicApi.placeOrder(qrToken, body),
    });
}