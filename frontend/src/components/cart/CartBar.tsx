import { formatCurrency } from "@/lib/format";

type CartBarProps = {
    itemCount: number;
    subtotal: number;
    onOpen: () => void;
};

export function CartBar({ itemCount, subtotal, onOpen }: CartBarProps) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070b10]/85 p-4 backdrop-blur-xl">
            <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-zinc-400">{itemCount} items</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(subtotal)}</p>
                </div>
                <button type="button" onClick={onOpen} className="btn-primary">
                    View cart
                </button>
            </div>
        </div>
    );
}
