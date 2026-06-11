const prefix = "orderly_active_order_";

export const activeOrderStorage = {
    get: (qrToken: string): string | null => {
        return sessionStorage.getItem(`${prefix}${qrToken}`);
    },
    set: (qrToken: string, orderId: string) => {
        sessionStorage.setItem(`${prefix}${qrToken}`, orderId);
    },
    clear: (qrToken: string) => {
        sessionStorage.removeItem(`${prefix}${qrToken}`);
    }
}