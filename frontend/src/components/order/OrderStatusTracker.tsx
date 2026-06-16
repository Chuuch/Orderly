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
            <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                This order was cancelled.
            </div>
        );
    }

    if (status === "SERVED" || status === "PAID") {
        return (
            <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">
                Your order has been served. Enjoy!
            </div>
        );
    }

    const activeIndex = getActiveStepIndex(status);

    return (
        <div className="mt-6">
            <p className="mb-4 text-sm font-medium text-stone-700">Order progress</p>
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
                                        ? "bg-emerald-600 text-white"
                                        : isCurrent
                                          ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500"
                                          : "bg-stone-100 text-stone-400",
                                ].join(" ")}
                            >
                                {isComplete ? "✓" : index + 1}
                            </span>
                            <span
                                className={[
                                    "text-sm",
                                    isCurrent
                                        ? "font-semibold text-stone-900"
                                        : isComplete
                                          ? "text-stone-600"
                                          : "text-stone-400",
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