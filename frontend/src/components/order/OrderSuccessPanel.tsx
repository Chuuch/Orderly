import { OrderStatusTracker } from "@/components/order/OrderStatusTracker";
import { usePublicOrderStatus } from "@/hooks/queries/usePublicOrderStatus";
import { formatCurrency } from "@/lib/format";
import type { OrderResponse } from "@/types/order";

type OrderSuccessPanelProps = {
    order: OrderResponse;
    restaurantName: string;
    tableNumber: string;
    onOrderMore: () => void;
};

export function OrderSuccessPanel({
    order: initialOrder,
    restaurantName,
    tableNumber,
    onOrderMore,
}: OrderSuccessPanelProps) {
    const { data: order = initialOrder } = usePublicOrderStatus(initialOrder.id, initialOrder);

    return (
        <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-12">
            <div className="w-full rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-600/5">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                        ✓
                    </div>
                    <h1 className="text-2xl font-bold text-stone-900">Order placed!</h1>
                    <p className="mt-2 text-stone-600">
                        {restaurantName} · Table {tableNumber}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                        We&apos;ll update this page as your order progresses.
                    </p>
                </div>

                <OrderStatusTracker status={order.status} />

                <div className="mt-6 rounded-2xl bg-stone-50 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-500">Total</span>
                        <span className="text-lg font-bold text-stone-900">
                            {formatCurrency(order.totalAmount)}
                        </span>
                    </div>
                </div>

                <ul className="mt-4 space-y-2">
                    {order.items.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between text-sm text-stone-700"
                        >
                            <span>
                                {item.quantity}× {item.menuItemName}
                            </span>
                            <span>{formatCurrency(item.subTotal)}</span>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    onClick={onOrderMore}
                    className="mt-8 w-full rounded-2xl border border-stone-200 bg-white py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                >
                    Order more
                </button>
            </div>
        </main>
    );
}