import { formatCurrency } from "@/lib/format";

type CartBarProps = {
    itemCount: number;
    subtotal: number;
    onOpen: () => void;
};

export function CartBar({ itemCount, subtotal, onOpen }: CartBarProps) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200/80 bg-white/90 p-4 backdrop-blur-md">
            <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-stone-500">{itemCount} items</p>
                    <p className="text-lg font-bold text-stone-900">
                        {formatCurrency(subtotal)}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onOpen}
                    className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98]"
                >
                    View cart
                </button>
            </div>
        </div>
    );
}