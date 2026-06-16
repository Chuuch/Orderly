import { KitchenOrderCard } from "@/components/kitchen/KitchenOrderCard";
import type { OrderResponse, OrderStatus } from "@/types/order";

type KitchenStatusColumnProps = {
    title: string;
    status: OrderStatus;
    accentClass: string;
    orders: OrderResponse[];
    pendingOrderId: string | null;
    onConfirm: (orderId: string) => void;
    onAdvance: (orderId: string, status: OrderStatus) => void;
};

export function KitchenStatusColumn({
    title,
    accentClass,
    orders,
    pendingOrderId,
    onConfirm,
    onAdvance,
}: KitchenStatusColumnProps) {
    return (
        <section className="flex min-h-[420px] flex-col rounded-3xl border border-stone-200 bg-stone-100/80 p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-600">
                    {title}
                </h2>
                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold text-white ${accentClass}`}
                >
                    {orders.length}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
                {orders.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-4 py-10 text-center text-sm text-stone-500">
                        No orders
                    </div>
                ) : (
                    orders.map((order) => (
                        <KitchenOrderCard
                            key={order.id}
                            order={order}
                            isUpdating={pendingOrderId === order.id}
                            onConfirm={() => onConfirm(order.id)}
                            onAdvance={(status) => onAdvance(order.id, status)}
                        />
                    ))
                )}
            </div>
        </section>
    );
}