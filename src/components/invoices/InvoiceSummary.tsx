import React from "react";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";
import { calcTotal, formatCurrency } from "./InvoiceTypes.tsx";

type InvoiceSummaryProps = {
    subtotal: number;
    taxRate: number;
    onChangeTaxRate: (v: number) => void;
    onSave: () => void;
    onSendEmail: () => void;
};

export function InvoiceSummary({
                                   subtotal,
                                   taxRate,
                                   onChangeTaxRate,
                                   onSave,
                                   onSendEmail,
                               }: InvoiceSummaryProps) {
    const { tax, total } = calcTotal(subtotal, taxRate);

    return (
        <aside className="flex flex-col gap-3.5">
        <section className="rounded-[18px] border border-slate-900/10 bg-white/85 p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.08)] backdrop-blur-[10px]">
        <h2 className="mb-2.5 text-sm font-extrabold tracking-[-0.01em] text-slate-950">
            Summary
            </h2>

            <div className="space-y-2.5">
    <div className="flex items-center justify-between text-sm">
    <span className="font-semibold text-slate-900/60">Subtotal</span>
        <span className="font-semibold text-slate-950">{formatCurrency(subtotal)}</span>
        </div>

        <div className="grid grid-cols-[1fr_120px] items-center gap-2">
    <div className="text-sm font-semibold text-slate-900/60">Tax rate \(\%\)</div>
    <Input
    type="number"
    inputMode="decimal"
    value={String(taxRate)}
    onChange={(e) => onChangeTaxRate(Number(e.target.value || 0))}
    min={0}
    step="0.01"
        />
        </div>

        <div className="flex items-center justify-between text-sm">
    <span className="font-semibold text-slate-900/60">Tax</span>
        <span className="font-semibold text-slate-950">{formatCurrency(tax)}</span>
        </div>

        <div className="h-px bg-slate-900/10" />

    <div className="flex items-center justify-between">
    <span className="text-sm font-extrabold text-slate-950">Total</span>
        <span className="text-lg font-extrabold tracking-[-0.02em] text-slate-950">
        {formatCurrency(total)}
        </span>
        </div>
        </div>
        </section>

        <section className="rounded-[18px] border border-slate-900/10 bg-white/85 p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.08)] backdrop-blur-[10px]">
    <h2 className="mb-2.5 text-sm font-extrabold tracking-[-0.01em] text-slate-950">
        Actions
        </h2>

        <div className="flex flex-col gap-2.5">
    <Button onClick={onSave}>Save to storage \(stub\)</Button>
    <Button variant="outline" onClick={onSendEmail}>
        Send via email \(stub\)
    </Button>
    </div>
    </section>
    </aside>
);
}