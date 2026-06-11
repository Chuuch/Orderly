import { formatCurrency } from "@/lib/format";
import type { OrderResponse } from "@/types/order";

type OrderSuccessPanelProps = {
    order: OrderResponse;
    restaurantName: string;
    tableNumber: string;
    onOrderMore: () => void;
};

export function OrderSuccessPanel({
    order,
    restaurantName,
    tableNumber,
    onOrderMore,
}: OrderSuccessPanelProps) {
    return (
        <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-12">
            <div className="w-full rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-emerald-600/5">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                    ✓
                </div>
                <h1 className="text-2xl font-bold text-stone-900">Order placed!</h1>
                <p className="mt-2 text-stone-600">
                    {restaurantName} · Table {tableNumber}
                </p>

                <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-left">
                    <p className="text-sm text-stone-500">Order ID</p>
                    <p className="mt-1 break-all font-mono text-sm text-stone-800">{order.id}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-stone-500">Status</span>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            {order.status}
                        </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-stone-500">Total</span>
                        <span className="text-lg font-bold text-stone-900">
                            {formatCurrency(order.totalAmount)}
                        </span>
                    </div>
                </div>

                <ul className="mt-6 space-y-2 text-left">
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