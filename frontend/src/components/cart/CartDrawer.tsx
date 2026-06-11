import { formatCurrency } from "@/lib/format";
import type { CartLine } from "@/types/order";
import { useEffect, useState, type FormEventHandler } from "react";

type CartDrawerProps = {
    open: boolean;
    lines: CartLine[];
    subtotal: number;
    isSubmitting: boolean;
    errorMessage?: string;
    onClose: () => void;
    onUpdateQuantity: (menuItemId: string, quantity: number) => void;
    onSubmit: (orderNotes: string) => void;
};

export function CartDrawer({
    open,
    lines,
    subtotal,
    isSubmitting,
    errorMessage,
    onClose,
    onUpdateQuantity,
    onSubmit,
}: CartDrawerProps) {
    const [orderNotes, setOrderNotes] = useState("");

    useEffect(() => {
        if (!open) setOrderNotes("");
    }, [open]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        onSubmit(orderNotes.trim());
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <button
                type="button"
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
                onClick={onClose}
                aria-label="Close cart"
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto max-h-[85vh] max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-stone-900">Your order</h2>
                        <p className="text-sm text-stone-500">{lines.length} unique items</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex max-h-[calc(85vh-4rem)] flex-col">
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {lines.length === 0 ? (
                            <p className="py-8 text-center text-stone-500">Your cart is empty.</p>
                        ) : (
                            <ul className="space-y-4">
                                {lines.map((line) => (
                                    <li
                                        key={line.menuItemId}
                                        className="flex items-center justify-between gap-4 rounded-2xl bg-stone-50 p-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium text-stone-900">{line.name}</p>
                                            <p className="text-sm text-stone-500">
                                                {formatCurrency(line.price)} each
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-2 py-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            line.menuItemId,
                                                            line.quantity - 1,
                                                        )
                                                    }
                                                    className="h-7 w-7 rounded-lg text-lg hover:bg-stone-50"
                                                >
                                                    −
                                                </button>
                                                <span className="min-w-5 text-center text-sm font-semibold">
                                                    {line.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            line.menuItemId,
                                                            line.quantity + 1,
                                                        )
                                                    }
                                                    className="h-7 w-7 rounded-lg text-lg hover:bg-stone-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="w-20 text-right font-semibold text-stone-900">
                                                {formatCurrency(line.price * line.quantity)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <label className="mt-6 block">
                            <span className="mb-2 block text-sm font-medium text-stone-700">
                                Order notes (optional)
                            </span>
                            <textarea
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                rows={3}
                                placeholder="Allergies, timing, etc."
                                className="w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/0 transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />
                        </label>

                        {errorMessage && (
                            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                                {errorMessage}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-stone-100 bg-white px-6 py-4">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-stone-600">Subtotal</span>
                            <span className="text-xl font-bold text-stone-900">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>
                        <button
                            type="submit"
                            disabled={lines.length === 0 || isSubmitting}
                            className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
                        >
                            {isSubmitting ? "Placing order..." : "Place order"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}