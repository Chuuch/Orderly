export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "SERVED"
    | "PAID"
    | "CANCELLED";

export type OrderItemRequest = {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
};

export type PublicCreateOrderRequest = {
    items: OrderItemRequest[];
    specialInstructions?: string;
};

export type OrderItemResponse = {
    id: string;
    menuItemId: string;
    menuItemName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
    specialInstructions?: string;
    createdAt: string;
};

export type OrderResponse = {
    id: string;
    restaurantId: string;
    restaurantTableId: string;
    userId: string;
    status: OrderStatus;
    totalAmount: number;
    taxAmount: number;
    discountAmount: number;
    specialInstructions?: string;
    items: OrderItemResponse[];
    estimatedReadyTime?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
};

export type CartLine = {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
}