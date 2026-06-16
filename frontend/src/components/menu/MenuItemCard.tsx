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
        <article className="flex gap-4 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                🍽️
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="font-semibold text-stone-900">{item.name}</h3>
                        {item.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                                {item.description}
                            </p>
                        )}
                    </div>
                    <p className="shrink-0 font-semibold text-emerald-700">
                        {formatCurrency(item.price)}
                    </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {item.isVegetarian && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Vegetarian
                        </span>
                    )}
                    {item.isSpicy && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            Spicy
                        </span>
                    )}
                    {!available && (
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                            Unavailable
                        </span>
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    {!available ? null : quantity === 0 ? (
                        <button
                            type="button"
                            onClick={onAdd}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
                        >
                            Add
                        </button>
                    ) : (
                        <div className="inline-flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-2 py-1">
                            <button
                                type="button"
                                onClick={onDecrement}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-semibold text-stone-700 hover:bg-white"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={onIncrement}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-semibold text-stone-700 hover:bg-white"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}