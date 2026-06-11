import { OrderStatusTracker } from "@/components/order/OrderStatusTracker";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
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
        <>
            <PageBackdrop variant="auth" />
            <main className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-12">
                <GlassCard className="w-full p-8">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-3xl ring-1 ring-emerald-400/30">
                            ✓
                        </div>
                        <h1 className="text-2xl font-bold text-white">Order placed!</h1>
                        <p className="mt-2 text-zinc-400">
                            {restaurantName} · Table {tableNumber}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                            We&apos;ll update this page as your order progresses.
                        </p>
                    </div>

                    <OrderStatusTracker status={order.status} />

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Total</span>
                            <span className="text-lg font-bold text-white">
                                {formatCurrency(order.totalAmount)}
                            </span>
                        </div>
                    </div>

                    <ul className="mt-4 space-y-2">
                        {order.items.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between text-sm text-zinc-300"
                            >
                                <span>
                                    {item.quantity}× {item.menuItemName}
                                </span>
                                <span className="text-zinc-500">{formatCurrency(item.subTotal)}</span>
                            </li>
                        ))}
                    </ul>

                    <button type="button" onClick={onOrderMore} className="btn-ghost mt-8 w-full">
                        Order more
                    </button>
                </GlassCard>
            </main>
        </>
    );
}
