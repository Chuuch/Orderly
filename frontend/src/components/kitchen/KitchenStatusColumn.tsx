import { KitchenOrderCard } from "@/components/kitchen/KitchenOrderCard";
import { GlassCard } from "@/components/ui/GlassCard";
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
        <GlassCard className="flex min-h-[420px] flex-col p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
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
                    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-zinc-500">
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
        </GlassCard>
    );
}
