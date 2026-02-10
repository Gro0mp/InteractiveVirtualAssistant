// src/components/invoices/types.ts
export type Provider = "google-sheets" | "excel";
export type Storage = "google-drive" | "onedrive";

export type LineItem = {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
};

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

export function calcSubtotal(items: LineItem[]) {
    return items.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);
}

export function calcTotal(subtotal: number, taxRate: number) {
    const tax = subtotal * (taxRate / 100);
    return { tax, total: subtotal + tax };
}