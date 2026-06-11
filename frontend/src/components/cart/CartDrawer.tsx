import { formatCurrency } from "@/lib/format";
import type { CartLine } from "@/types/order";
import { useEffect, useState, type SubmitEventHandler } from "react";

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

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        onSubmit(orderNotes.trim());
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <button
                type="button"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-label="Close cart"
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto max-h-[85vh] max-w-lg overflow-hidden rounded-t-3xl border border-white/10 bg-[#0c1219] shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-white">Your order</h2>
                        <p className="text-sm text-zinc-400">{lines.length} unique items</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex max-h-[calc(85vh-4rem)] flex-col">
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {lines.length === 0 ? (
                            <p className="py-8 text-center text-zinc-400">Your cart is empty.</p>
                        ) : (
                            <ul className="space-y-4">
                                {lines.map((line) => (
                                    <li
                                        key={line.menuItemId}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-medium text-white">{line.name}</p>
                                            <p className="text-sm text-zinc-400">
                                                {formatCurrency(line.price)} each
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            line.menuItemId,
                                                            line.quantity - 1,
                                                        )
                                                    }
                                                    className="h-7 w-7 rounded-lg text-lg text-zinc-200 hover:bg-white/10"
                                                >
                                                    −
                                                </button>
                                                <span className="min-w-5 text-center text-sm font-semibold text-white">
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
                                                    className="h-7 w-7 rounded-lg text-lg text-zinc-200 hover:bg-white/10"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="w-20 text-right font-semibold text-emerald-400">
                                                {formatCurrency(line.price * line.quantity)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <label className="mt-6 block">
                            <span className="mb-2 block text-sm font-medium text-zinc-300">
                                Order notes (optional)
                            </span>
                            <textarea
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                rows={3}
                                placeholder="Allergies, timing, etc."
                                className="field resize-none"
                            />
                        </label>

                        {errorMessage && (
                            <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {errorMessage}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-white/10 bg-[#0a0f14]/90 px-6 py-4">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-zinc-400">Subtotal</span>
                            <span className="text-xl font-bold text-white">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>
                        <button
                            type="submit"
                            disabled={lines.length === 0 || isSubmitting}
                            className="btn-primary w-full"
                        >
                            {isSubmitting ? "Placing order…" : "Place order"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
