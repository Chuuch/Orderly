import type { OrderStatus } from "@/types/order";

export type KitchenMessageType = "ORDER_CREATED" | "ORDER_STATUS_CHANGED";

export type KitchenWebSocketMessage = {
    type: KitchenMessageType;
    payload: OrderCreatedWsPayload | OrderStatusChangedWsPayload;
};

export type OrderCreatedWsPayload = {
    restaurant_id: string;
    order_id: string;
    table_id: string;
    user_id: string;
    total_amount: number;
    items: {
        menu_item_id: string;
        menu_item_name: string;
        quantity: number;
        unit_price: number;
        special_instructions?: string;
    }[];
    special_instructions?: string;
};

export type OrderStatusChangedWsPayload = {
    restaurant_id: string;
    order_id: string;
    table_id: string;
    old_status: OrderStatus;
    new_status: OrderStatus;
    changed_by?: string;
};

export type WsConnectionState = "connecting" | "connected" | "disconnected" | "error";