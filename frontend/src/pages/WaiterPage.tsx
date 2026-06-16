import { GlassCard } from "@/components/ui/GlassCard";
import { useWaiterReadyOrders } from "@/hooks/queries/useWaiterReadyOrders";
import { ordersApi } from "@/api/orders.api";
import { formatCurrency } from "@/lib/format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export function WaiterPage() {
    const { session } = useAuth();
    const queryClient = useQueryClient();
    const { data: orders = [], isPending, isError } = useWaiterReadyOrders();

    const markServed = useMutation({
        mutationFn: ordersApi.markServed,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["waiter-ready-orders", session?.restaurantId],
            }),
    });

    if (isPending) return <p className="text-zinc-400">Loading ready orders…</p>;
    if (isError) return <p className="text-red-300">Failed to load orders.</p>;

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                    Floor
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white">Ready to serve</h1>
                <p className="mt-2 text-sm text-zinc-400">
                    Orders marked ready by the kitchen appear here.
                </p>
            </div>

            {orders.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-zinc-400">
                    No orders ready right now.
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {orders.map((order) => (
                        <GlassCard key={order.id} className="p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        Table {order.tableNumber ?? "—"}
                                    </h2>
                                    <p className="mt-1 text-sm text-zinc-400">
                                        {order.items.length} item{order.items.length === 1 ? "" : "s"}
                                    </p>
                                </div>
                                <span className="text-sm font-semibold text-emerald-400">
                                    {formatCurrency(order.totalAmount)}
                                </span>
                            </div>

                            <ul className="mt-4 space-y-1 text-sm text-zinc-300">
                                {order.items.map((item) => (
                                    <li key={item.id}>
                                        {item.quantity}× {item.menuItemName}
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                className="btn-primary mt-4 w-full"
                                disabled={markServed.isPending}
                                onClick={() => markServed.mutate(order.id)}
                            >
                                Mark served
                            </button>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}