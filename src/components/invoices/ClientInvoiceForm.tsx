import React from "react";
import { Input } from "../ui/Input.tsx";

type ClientInvoiceFormProps = {
    clientName: string;
    clientEmail: string;
    invoiceNumber: string;
    notes: string;
    onChange: (patch: Partial<{
        clientName: string;
        clientEmail: string;
        invoiceNumber: string;
        notes: string;
    }>) => void;
};

export function ClientInvoiceForm({
                                      clientName,
                                      clientEmail,
                                      invoiceNumber,
                                      notes,
                                      onChange,
                                  }: ClientInvoiceFormProps) {
    return (
        <section className="rounded-[18px] border border-slate-900/10 bg-white/85 p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.08)] backdrop-blur-[10px]">
            <h2 className="mb-2.5 text-sm font-extrabold tracking-[-0.01em] text-slate-950">
                Invoice details
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                    label="Client name"
                    value={clientName}
                    onChange={(e) => onChange({ clientName: e.target.value })}
                    placeholder="Acme Inc\."
                />
                <Input
                    label="Client email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => onChange({ clientEmail: e.target.value })}
                    placeholder="billing@acme\.com"
                />
                <Input
                    label="Invoice number"
                    value={invoiceNumber}
                    onChange={(e) => onChange({ invoiceNumber: e.target.value })}
                    placeholder="INV\-\-0001"
                />
                <div className="w-full">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => onChange({ notes: e.target.value })}
                        className="min-h-[92px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-100"
                        placeholder="Payment terms, thanks message, etc\."
                    />
                </div>
            </div>
        </section>
    );
}
