export function formatCurrency(amount: number, currency = "EUR"): string {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}