import type { OrderStatus } from "@/types/order";

export const ORDER_TRACKING_POLL_MS = 5_000;

export const TERMINAL_ORDER_STATUSES: OrderStatus[] = [
    "SERVED",
    "PAID",
    "CANCELLED",
];

export const CUSTOMER_TRACKING_STEPS = [
    { status: "PENDING" as const, label: "Order received" },
    { status: "CONFIRMED" as const, label: "Confirmed" },
    { status: "PREPARING" as const, label: "Preparing" },
    { status: "READY" as const, label: "Ready for pickup" },
];

export function isTerminalOrderStatus(status: OrderStatus): boolean {
    return TERMINAL_ORDER_STATUSES.includes(status);
}

export function getActiveStepIndex(status: OrderStatus): number {
    const index = CUSTOMER_TRACKING_STEPS.findIndex((step) => step.status === status);
    if (index >= 0) return index;
    if (status === "SERVED" || status === "PAID") return CUSTOMER_TRACKING_STEPS.length;
    return 0;
}