import { cartStorage } from "@/lib/cart-storage";
import type { CartLine } from "@/types/order";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useCart(qrToken: string | undefined) {
    const [lines, setLines] = useState<CartLine[]>(() =>
        qrToken ? cartStorage.get(qrToken) : []
    );

    useEffect(() => {
        if (qrToken) {
            setLines(cartStorage.get(qrToken));
        } else {
            setLines([]);
        }
    }, [qrToken]);

    const persist = useCallback(
        (next: CartLine[]) => {
            if (!qrToken) return;
            setLines(next);
            cartStorage.set(qrToken, next);
        },
        [qrToken],
    );

    const addItem = useCallback(
        (item: { menuItemId: string; name: string; price: number }) => {
            persist(
                (() => {
                    const existing = lines.find((l) => l.menuItemId === item.menuItemId);
                    if (existing) {
                        return lines.map((l) =>
                            l.menuItemId === item.menuItemId
                                ? { ...l, quantity: l.quantity + 1 }
                                : l
                        );
                    }
                    return [...lines, { ...item, quantity: 1 }];
                })(),
            );
        },
        [lines, persist],
    );

    const updateQuantity = useCallback(
        (menuItemId: string, quantity: number) => {
            if (quantity <= 0) {
                persist(lines.filter((l) => l.menuItemId !== menuItemId));
                return;
            }
            persist(
                lines.map((l) => 
                    l.menuItemId === menuItemId ? { ...l, quantity } : l,
                ),
            );
        },
        [lines, persist],
    );

    const clear = useCallback(() => {
        if (qrToken) cartStorage.clear(qrToken);
        setLines([]);
    }, [qrToken]);

    const itemCount = useMemo(
        () => lines.reduce((sum, l) => sum + l.quantity, 0),
        [lines],
    );

    const subTotal = useMemo(
        () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
        [lines],
    );

    const getQuantity = useCallback(
        (menuItemId: string) =>
            lines.find((l) => l.menuItemId === menuItemId)?.quantity ?? 0,
        [lines],
    );

    return {
        lines,
        itemCount,
        subTotal,
        addItem,
        updateQuantity,
        clear,
        getQuantity,
        isEmpty: lines.length === 0,
    };
}