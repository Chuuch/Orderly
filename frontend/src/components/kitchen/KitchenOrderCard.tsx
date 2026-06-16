import { formatCurrency } from "@/lib/format";
import type { OrderResponse, OrderStatus } from "@/types/order";

type KitchenOrderCardProps = {
    order: OrderResponse;
    isUpdating: boolean;
    onConfirm: () => void;
    onAdvance: (status: OrderStatus) => void;
};

function formatTableLabel(order: OrderResponse): string {
    return order.tableNumber
        ? `Table ${order.tableNumber}`
        : `Table ···${order.restaurantTableId.slice(-4).toUpperCase()}`;
}

function formatTime(iso: string | undefined): string {
    if (!iso) return "—";
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
                : order.status === "READY"
                  ? { label: "Mark served", onClick: () => onAdvance("SERVED") }
                  : null;

    return (
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.08]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-white">{formatTableLabel(order)}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                        {formatTime(order.createdAt)} · {order.items.length} items
                    </p>
                </div>
                <p className="text-sm font-bold text-emerald-400">
                    {formatCurrency(order.totalAmount)}
                </p>
            </div>

            <ul className="mt-3 space-y-1.5">
                {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm text-zinc-300">
                        <span>
                            {item.quantity}× {item.menuItemName}
                        </span>
                        <span className="text-zinc-500">{formatCurrency(item.subTotal)}</span>
                    </li>
                ))}
            </ul>

            {order.specialInstructions && (
                <p className="mt-3 rounded-xl bg-amber-500/10 px-3 py-2 text-sm text-amber-200 ring-1 ring-amber-400/20">
                    Note: {order.specialInstructions}
                </p>
            )}

            {action && (
                <button
                    type="button"
                    disabled={isUpdating}
                    onClick={action.onClick}
                    className="btn-primary mt-4 w-full"
                >
                    {isUpdating ? "Updating…" : action.label}
                </button>
            )}
        </article>
    );
}
