import type { CartLine } from "@/types/order";

const prefix = "orderly_cart_";

export const cartStorage = {
    get: (qrToken: string): CartLine[] => {
        const raw = sessionStorage.getItem(`${prefix}${qrToken}`);
        return raw ? (JSON.parse(raw) as CartLine[]) : [];
    },
    set: (qrToken: string, lines: CartLine[]) => {
        if (lines.length === 0) {
            sessionStorage.removeItem(`${prefix}${qrToken}`);
            return;
        }
        sessionStorage.setItem(`${prefix}${qrToken}`, JSON.stringify(lines));
    },
    clear: (qrToken: string) => {
        sessionStorage.removeItem(`${prefix}${qrToken}`);
    }
}