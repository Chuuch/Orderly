import { ordersApi } from "@/api/orders.api";
import { useAuth } from "@/hooks/useAuth";
import { READY_MAX_AGE_MS } from "@/lib/kitchen-config";
import { subscribeKitchenTopic } from "@/lib/ws-client";
import type { WsConnectionState } from "@/types/kitchen";
import type { OrderResponse, OrderStatus } from "@/types/order";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const ACTIVE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY"];

function isVisibleKitchenOrder(order: OrderResponse): boolean {
    if (!ACTIVE_STATUSES.includes(order.status)) {
        return false;
    }

    if (order.status === "READY" && order.updatedAt) {
        const ageMs = Date.now() - new Date(order.updatedAt).getTime();
        return ageMs < READY_MAX_AGE_MS;
    }

    return true;
}

export function useKitchenOrders() {
    const { session } = useAuth();
    const restaurantId = session?.restaurantId;
    const queryClient = useQueryClient();
    const [connectionState, setConnectionState] = useState<WsConnectionState>("connecting");

    const query = useQuery({
        queryKey: ["kitchen-orders", restaurantId],
        queryFn: () => ordersApi.getRecentOrders(restaurantId!),
        enabled: Boolean(restaurantId),
        refetchInterval: 60_000,
    });

    useEffect(() => {
        if (!restaurantId) return;

        setConnectionState("connecting");

        const client = subscribeKitchenTopic(
            restaurantId,
            () => {
                queryClient.invalidateQueries({ queryKey: ["kitchen-orders", restaurantId] });
            },
            (connected) => {
                setConnectionState(connected ? "connected" : "disconnected");
            },
        );

        client.activate();

        return () => {
            client.deactivate();
            setConnectionState("disconnected");
        };
    }, [restaurantId, queryClient]);

    const activeOrders = useMemo(() => {
        return (query.data ?? [])
            .filter(isVisibleKitchenOrder)
            .sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            );
    }, [query.data]);

    const ordersByStatus = useMemo(() => {
        const grouped: Record<OrderStatus, OrderResponse[]> = {
            PENDING: [],
            CONFIRMED: [],
            PREPARING: [],
            READY: [],
            SERVED: [],
            PAID: [],
            CANCELLED: [],
        };

        for (const order of activeOrders) {
            grouped[order.status].push(order);
        }

        return grouped;
    }, [activeOrders]);

    return {
        ...query,
        activeOrders,
        ordersByStatus,
        connectionState,
        restaurantId,
    };
}