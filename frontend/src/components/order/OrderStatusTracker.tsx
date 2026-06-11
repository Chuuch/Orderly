import {
    CUSTOMER_TRACKING_STEPS,
    getActiveStepIndex,
} from "@/lib/order-tracking-config";
import type { OrderStatus } from "@/types/order";

type OrderStatusTrackerProps = {
    status: OrderStatus;
};

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
    if (status === "CANCELLED") {
        return (
            <div className="mt-6 rounded-2xl bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-300 ring-1 ring-red-400/20">
                This order was cancelled.
            </div>
        );
    }

    if (status === "SERVED" || status === "PAID") {
        return (
            <div className="mt-6 rounded-2xl bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/20">
                Your order has been served. Enjoy!
            </div>
        );
    }

    const activeIndex = getActiveStepIndex(status);

    return (
        <div className="mt-6">
            <p className="mb-4 text-sm font-medium text-zinc-300">Order progress</p>
            <ol className="space-y-4">
                {CUSTOMER_TRACKING_STEPS.map((step, index) => {
                    const isComplete = index < activeIndex;
                    const isCurrent = index === activeIndex;

                    return (
                        <li key={step.status} className="flex items-center gap-3">
                            <span
                                className={[
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                                    isComplete
                                        ? "bg-emerald-500 text-white"
                                        : isCurrent
                                          ? "bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/50"
                                          : "bg-white/5 text-zinc-500 ring-1 ring-white/10",
                                ].join(" ")}
                            >
                                {isComplete ? "✓" : index + 1}
                            </span>
                            <span
                                className={[
                                    "text-sm",
                                    isCurrent
                                        ? "font-semibold text-white"
                                        : isComplete
                                          ? "text-zinc-300"
                                          : "text-zinc-500",
                                ].join(" ")}
                            >
                                {step.label}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
