// src/pages/InvoiceManagementPage.tsx
import React, { useMemo, useState } from "react";
import { InvoiceHeader } from "../components/invoices/InvoiceHeader";
import { ClientInvoiceForm } from "../components/invoices/ClientInvoiceForm";
import { LineItemsTable } from "../components/invoices/LineItemsTable";
import { InvoiceSummary } from "../components/invoices/InvoiceSummary";
import type { LineItem, Provider, Storage } from "../components/invoices/InvoiceTypes.tsx";
import { calcSubtotal } from "../components/invoices/InvoiceTypes.tsx";
import { MiniOrbLink } from "../components/ui/MiniOrbLink.tsx";

function makeId() {
    return Math.random().toString(36).slice(2, 10);
}

export function InvoiceManagementPage() {
    const [provider, setProvider] = useState<Provider>("google-sheets");
    const [storage, setStorage] = useState<Storage>("google-drive");

    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
    const [notes, setNotes] = useState("");
    const [taxRate, setTaxRate] = useState<number>(0);

    const [lineItems, setLineItems] = useState<LineItem[]>([
        { id: makeId(), description: "Service", quantity: 1, unitPrice: 100 },
    ]);

    const subtotal = useMemo(() => calcSubtotal(lineItems), [lineItems]);

    const handleAddLine = () => {
        setLineItems((prev) => [
            ...prev,
            { id: makeId(), description: "", quantity: 1, unitPrice: 0 },
        ]);
    };

    const handleRemoveLine = (id: string) => {
        setLineItems((prev) => prev.filter((l) => l.id !== id));
    };

    const handleUpdateLine = (id: string, patch: Partial<LineItem>) => {
        setLineItems((prev) =>
            prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        );
    };

    const handleConnect = () => {
        alert(`Connect stub: ${provider}`);
    };

    const handleImportTemplate = () => {
        alert(`Import template stub: ${provider}`);
    };

    const handleSave = () => {
        alert(`Save stub: ${storage}`);
    };

    const handleSendEmail = () => {
        alert(`Send email stub to: ${clientEmail || "(missing email)"}`);
    };

    return (
        <div className="relative min-h-screen bg-white text-slate-950">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(43,109,255,0.12),transparent_60%),radial-gradient(900px_620px_at_80%_10%,rgba(109,224,255,0.14),transparent_55%)]" />
            </div>

            <MiniOrbLink />


            <div className="mx-auto max-w-[1120px] px-5 pb-14 pt-7">
                <InvoiceHeader
                    provider={provider}
                    storage={storage}
                    onChangeProvider={setProvider}
                    onChangeStorage={setStorage}
                    onConnect={handleConnect}
                    onImportTemplate={handleImportTemplate}
                />

                <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.6fr_1fr]">
                    <div className="flex flex-col gap-3.5">
                        <ClientInvoiceForm
                            clientName={clientName}
                            clientEmail={clientEmail}
                            invoiceNumber={invoiceNumber}
                            notes={notes}
                            onChange={(patch) => {
                                if (patch.clientName !== undefined) setClientName(patch.clientName);
                                if (patch.clientEmail !== undefined) setClientEmail(patch.clientEmail);
                                if (patch.invoiceNumber !== undefined) setInvoiceNumber(patch.invoiceNumber);
                                if (patch.notes !== undefined) setNotes(patch.notes);
                            }}
                        />

                        <LineItemsTable
                            items={lineItems}
                            onAdd={handleAddLine}
                            onRemove={handleRemoveLine}
                            onUpdate={handleUpdateLine}
                        />
                    </div>

                    <InvoiceSummary
                        subtotal={subtotal}
                        taxRate={taxRate}
                        onChangeTaxRate={setTaxRate}
                        onSave={handleSave}
                        onSendEmail={handleSendEmail}
                    />
                </div>
            </div>
        </div>
    );
}
