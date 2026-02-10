import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button.tsx";
import type { Provider, Storage } from "./InvoiceTypes.tsx";

type InvoiceHeaderProps = {
    provider: Provider;
    storage: Storage;
    onChangeProvider: (p: Provider) => void;
    onChangeStorage: (s: Storage) => void;
    onConnect: () => void;
    onImportTemplate: () => void;
};

export function InvoiceHeader({
                                  provider,
                                  storage,
                                  onChangeProvider,
                                  onChangeStorage,
                                  onConnect,
                                  onImportTemplate,
                              }: InvoiceHeaderProps) {
    return (
        <div className="mb-5 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h1 className="m-0 text-2xl font-bold tracking-[-0.02em] text-slate-950">
                    Invoice Management
                </h1>
                <p className="mt-1.5 text-[13px] leading-snug text-slate-900/60">
                    Create invoices, import templates, and save or send them\.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
                <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                        Back
                    </Button>
                </Link>

                <div className="flex items-center gap-2">
                    <select
                        value={provider}
                        onChange={(e) => onChangeProvider(e.target.value as Provider)}
                        className="h-9 rounded-xl border border-slate-900/10 bg-white/90 px-3 text-[13px] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(11,18,32,0.06)] outline-none"
                        aria-label="Data provider"
                    >
                        <option value="google-sheets">Google Sheets</option>
                        <option value="excel">Excel</option>
                    </select>

                    <select
                        value={storage}
                        onChange={(e) => onChangeStorage(e.target.value as Storage)}
                        className="h-9 rounded-xl border border-slate-900/10 bg-white/90 px-3 text-[13px] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(11,18,32,0.06)] outline-none"
                        aria-label="Storage provider"
                    >
                        <option value="google-drive">Google Drive</option>
                        <option value="onedrive">OneDrive</option>
                    </select>
                </div>

                <Button variant="secondary" size="sm" onClick={onConnect}>
                    Connect
                </Button>
                <Button variant="outline" size="sm" onClick={onImportTemplate}>
                    Import template
                </Button>
            </div>
        </div>
    );
}