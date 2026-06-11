import { formatCurrency } from "@/lib/format";
import type { OrderResponse, OrderStatus } from "@/types/order";

type KitchenOrderCardProps = {
    order: OrderResponse;
    isUpdating: boolean;
    onConfirm: () => void;
    onAdvance: (status: OrderStatus) => void;
};

function formatTableLabel(order: OrderResponse): string {
    return order.tableNumber ? `Table ${order.tableNumber}` : `Table ···${order.restaurantTableId.slice(-4).toUpperCase()}`;
}

function formatTime(iso: string): string {
    return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(iso));
}

export function KitchenOrderCard({
    order,
    isUpdating,
    onConfirm,
    onAdvance,
}: KitchenOrderCardProps) {
    const action =
        order.status === "PENDING"
            ? { label: "Confirm", onClick: onConfirm }
            : order.status === "CONFIRMED"
              ? { label: "Start preparing", onClick: () => onAdvance("PREPARING") }
              : order.status === "PREPARING"
                ? { label: "Mark ready", onClick: () => onAdvance("READY") }
                : null;

    return (
        <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-stone-900">
                        {formatTableLabel(order)}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500">
                        {formatTime(order.createdAt)} · {order.items.length} items
                    </p>
                </div>
                <p className="text-sm font-bold text-stone-900">
                    {formatCurrency(order.totalAmount)}
                </p>
            </div>

            <ul className="mt-3 space-y-1.5">
                {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm text-stone-700">
                        <span>
                            {item.quantity}× {item.menuItemName}
                        </span>
                        <span className="text-stone-500">{formatCurrency(item.subTotal)}</span>
                    </li>
                ))}
            </ul>

            {order.specialInstructions && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    Note: {order.specialInstructions}
                </p>
            )}

            {action && (
                <button
                    type="button"
                    disabled={isUpdating}
                    onClick={action.onClick}
                    className="mt-4 w-full rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                    {isUpdating ? "Updating..." : action.label}
                </button>
            )}
        </article>
    );
}