import React from "react";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";
import type { LineItem } from "./InvoiceTypes.tsx";
import { formatCurrency } from "./InvoiceTypes.tsx";

type LineItemsTableProps = {
    items: LineItem[];
    onAdd: () => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, patch: Partial<LineItem>) => void;
};

export function LineItemsTable({
                                   items,
                                   onAdd,
                                   onRemove,
                                   onUpdate,
                               }: LineItemsTableProps) {
    return (
        <section className="rounded-[18px] border border-slate-900/10 bg-white/85 p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.08)] backdrop-blur-[10px]">
            <div className="mb-2.5 flex items-center justify-between gap-2">
                <h2 className="text-sm font-extrabold tracking-[-0.01em] text-slate-950">
                    Line items
                </h2>
                <Button size="sm" variant="outline" onClick={onAdd}>
                    Add line
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-separate border-spacing-0">
                    <thead>
                    <tr className="text-left text-xs font-semibold text-slate-900/60">
                        <th className="border-b border-slate-900/10 px-2 py-2">Description</th>
                        <th className="border-b border-slate-900/10 px-2 py-2 w-[140px]">Qty</th>
                        <th className="border-b border-slate-900/10 px-2 py-2 w-[180px]">Unit price</th>
                        <th className="border-b border-slate-900/10 px-2 py-2 w-[160px]">Amount</th>
                        <th className="border-b border-slate-900/10 px-2 py-2 w-[120px]"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((li) => {
                        const amount = li.quantity * li.unitPrice;
                        return (
                            <tr key={li.id} className="align-top">
                                <td className="border-b border-slate-900/10 px-2 py-2">
                                    <Input
                                        value={li.description}
                                        onChange={(e) => onUpdate(li.id, { description: e.target.value })}
                                        placeholder="Consulting services"
                                    />
                                </td>
                                <td className="border-b border-slate-900/10 px-2 py-2">
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        value={String(li.quantity)}
                                        onChange={(e) =>
                                            onUpdate(li.id, { quantity: Number(e.target.value || 0) })
                                        }
                                        min={0}
                                    />
                                </td>
                                <td className="border-b border-slate-900/10 px-2 py-2">
                                    <Input
                                        type="number"
                                        inputMode="decimal"
                                        value={String(li.unitPrice)}
                                        onChange={(e) =>
                                            onUpdate(li.id, { unitPrice: Number(e.target.value || 0) })
                                        }
                                        min={0}
                                        step="0.01"
                                    />
                                </td>
                                <td className="border-b border-slate-900/10 px-2 py-2">
                                    <div className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                                        {formatCurrency(amount)}
                                    </div>
                                </td>
                                <td className="border-b border-slate-900/10 px-2 py-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onRemove(li.id)}
                                        className="text-slate-700"
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
