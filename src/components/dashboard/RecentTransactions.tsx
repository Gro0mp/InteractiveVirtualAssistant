import React from "react";
import { ActivityItem } from "./ActivityItem.tsx";

export function RecentTransactions() {
    return (
        <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-extrabold tracking-[-0.01em]">
                        Recent Transactions
                    </h2>
                    <p className="mt-0.5 text-[12px] text-slate-500">Latest financial activity</p>
                </div>
                <button className="text-[11px] font-semibold text-violet-600 hover:text-violet-700">
                    View All
                </button>
            </div>

            <div className="flex flex-col gap-2">
                <ActivityItem
                    title="Payment received: Invoice #1247"
                    meta="$2,450 · 2h ago"
                    type="income"
                />
                <ActivityItem
                    title="Office supplies purchased"
                    meta="$184.50 · 5h ago"
                    type="expense"
                />
                <ActivityItem
                    title="Invoice sent: Client ABC Corp"
                    meta="$5,200 · Yesterday"
                    type="pending"
                />
                <ActivityItem
                    title="Subscription payment: Software Tools"
                    meta="$89.00 · Yesterday"
                    type="expense"
                />
                <ActivityItem
                    title="Payment received: Invoice #1246"
                    meta="$1,890 · 2 days ago"
                    type="income"
                />
            </div>
        </section>
    );
}