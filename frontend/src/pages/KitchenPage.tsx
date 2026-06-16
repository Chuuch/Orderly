import { KitchenStatusColumn } from "@/components/kitchen/KitchenStatusColumn";
import { useKitchenOrderActions } from "@/hooks/queries/useKitchenOrderActions";
import { useKitchenOrders } from "@/hooks/queries/useKitchenOrders";
import type { WsConnectionState } from "@/types/kitchen";
import type { OrderStatus } from "@/types/order";
import { useState } from "react";

const COLUMNS: {
    status: OrderStatus;
    title: string;
    accentClass: string;
}[] = [
    { status: "PENDING", title: "New", accentClass: "bg-amber-500" },
    { status: "CONFIRMED", title: "Confirmed", accentClass: "bg-sky-500" },
    { status: "PREPARING", title: "Preparing", accentClass: "bg-orange-500" },
    { status: "READY", title: "Ready", accentClass: "bg-emerald-500" },
];

function ConnectionBadge({ state }: { state: WsConnectionState }) {
    const styles: Record<WsConnectionState, string> = {
        connecting: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20",
        connected: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20",
        disconnected: "bg-white/5 text-zinc-400 ring-1 ring-white/10",
        error: "bg-red-500/15 text-red-300 ring-1 ring-red-400/20",
    };

    const labels: Record<WsConnectionState, string> = {
        connecting: "Connecting…",
        connected: "Live",
        disconnected: "Offline",
        error: "Error",
    };

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${styles[state]}`}
        >
            <span
                className={`h-2 w-2 rounded-full ${
                    state === "connected" ? "animate-pulse bg-emerald-400" : "bg-current"
                }`}
            />
            {labels[state]}
        </span>
    );
}

export function KitchenPage() {
    const { isPending, isError, error, ordersByStatus, connectionState, activeOrders } =
        useKitchenOrders();
    const { confirm, updateStatus } = useKitchenOrderActions();
    const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

    const isUpdating = confirm.isPending || updateStatus.isPending;

    const handleConfirm = (orderId: string) => {
        setPendingOrderId(orderId);
        confirm.mutate(orderId, {
            onSettled: () => setPendingOrderId(null),
        });
    };

    const handleAdvance = (orderId: string, status: OrderStatus) => {
        setPendingOrderId(orderId);
        updateStatus.mutate(
            { orderId, status },
            { onSettled: () => setPendingOrderId(null) },
        );
    };

    if (isPending) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
                    <p className="mt-4 text-sm text-zinc-400">Loading kitchen board…</p>
                </div>
            </div>
        );
    }

    if (isError) {
        const message =
            error && typeof error === "object" && "message" in error
                ? String((error as { message: string }).message)
                : "Failed to load orders";
        return (
            <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{message}</p>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                        Operations
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Kitchen board</h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        {activeOrders.length} active order{activeOrders.length === 1 ? "" : "s"}
                        {" · "}Ready orders auto-hide after 15 min
                    </p>
                </div>
                <ConnectionBadge state={connectionState} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {COLUMNS.map((column) => (
                    <KitchenStatusColumn
                        key={column.status}
                        title={column.title}
                        status={column.status}
                        accentClass={column.accentClass}
                        orders={ordersByStatus[column.status]}
                        pendingOrderId={isUpdating ? pendingOrderId : null}
                        onConfirm={handleConfirm}
                        onAdvance={handleAdvance}
                    />
                ))}
            </div>
        </div>
    );
}
