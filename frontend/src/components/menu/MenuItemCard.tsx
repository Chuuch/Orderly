import { GlassCard } from "@/components/ui/GlassCard";
import { formatCurrency } from "@/lib/format";
import type { MenuItemResponse } from "@/types/menu";

type MenuItemCardProps = {
    item: MenuItemResponse;
    quantity: number;
    onAdd: () => void;
    onIncrement: () => void;
    onDecrement: () => void;
};

export function MenuItemCard({
    item,
    quantity,
    onAdd,
    onIncrement,
    onDecrement,
}: MenuItemCardProps) {
    const available = item.isAvailable !== false;

    return (
        <GlassCard className="flex gap-4 p-4 transition hover:bg-white/[0.08]">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-2xl ring-1 ring-emerald-400/20">
                🍽️
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        {item.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                                {item.description}
                            </p>
                        )}
                    </div>
                    <p className="shrink-0 font-semibold text-emerald-400">
                        {formatCurrency(item.price)}
                    </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {item.isVegetarian && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/20">
                            Vegetarian
                        </span>
                    )}
                    {item.isSpicy && (
                        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-300 ring-1 ring-red-400/20">
                            Spicy
                        </span>
                    )}
                    {!available && (
                        <span className="rounded-full bg-zinc-500/15 px-2 py-0.5 text-xs font-medium text-zinc-400 ring-1 ring-zinc-400/20">
                            Unavailable
                        </span>
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    {!available ? null : quantity === 0 ? (
                        <button type="button" onClick={onAdd} className="btn-primary">
                            Add
                        </button>
                    ) : (
                        <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-2 py-1">
                            <button
                                type="button"
                                onClick={onDecrement}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-semibold text-zinc-200 hover:bg-white/10"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold text-white">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={onIncrement}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-semibold text-zinc-200 hover:bg-white/10"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}
