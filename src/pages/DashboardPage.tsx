import React from "react";
import { DashboardLayout } from "../components/DashboardLayout.tsx";
import { Link } from "react-router-dom";
import { FinancialMetrics } from "../components/dashboard/FinancialMetrics.tsx";
import { CashFlowChart } from "../components/dashboard/CashFlowChart.tsx";
import { RecentTransactions } from "../components/dashboard/RecentTransactions.tsx";
import { QuickActions } from "../components/dashboard/QuickActions.tsx";
import { UpcomingBills } from "../components/dashboard/UpcomingBills.tsx";
import { ProfitLossSnapshot } from "../components/dashboard/ProfitLossSnapshot.tsx";

export function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="relative min-h-screen bg-white text-slate-950">
                {/* Background gradient */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(43,109,255,0.10),transparent_60%),radial-gradient(900px_620px_at_80%_10%,rgba(109,224,255,0.12),transparent_55%)]"/>
                </div>

                <div className="mx-auto max-w-[1280px] px-5 pb-14 pt-7">
                    {/* Header */}
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row">
                        <div>
                            <h1 className="m-0 text-2xl font-bold tracking-[-0.02em]">
                                Financial Dashboard
                            </h1>
                            <div className="mt-1.5 text-[13px] leading-snug text-slate-900/60">
                                Your business finances at a glance
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Link
                                to="/assistant"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-white/90 px-3 text-[13px] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(11,18,32,0.06)] backdrop-blur hover:border-violet-300 transition-colors"
                            >
                                AI Assistant
                            </Link>
                            <Link
                                to="/transactions"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-white/90 px-3 text-[13px] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(11,18,32,0.06)] backdrop-blur hover:border-violet-300 transition-colors"
                            >
                                Transactions
                            </Link>
                            <Link
                                to="/invoices"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-white/90 px-3 text-[13px] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(11,18,32,0.06)] backdrop-blur hover:border-violet-300 transition-colors"
                            >
                                Invoices
                            </Link>
                            <Link
                                to="/reports"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-white/90 px-3 text-[13px] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(11,18,32,0.06)] backdrop-blur hover:border-violet-300 transition-colors"
                            >
                                Reports
                            </Link>
                            <Link
                                to="/documents"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-white/90 px-3 text-[13px] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(11,18,32,0.06)] backdrop-blur hover:border-violet-300 transition-colors"
                            >
                                Documents
                            </Link>
                        </div>
                    </div>

                    {/* Financial Metrics */}
                    <FinancialMetrics />

                    {/* Main Content Grid */}
                    <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.5fr_1fr]">
                        {/* Left Column */}
                        <div className="flex flex-col gap-4">
                            <CashFlowChart />
                            <ProfitLossSnapshot />
                            <RecentTransactions />
                        </div>

                        {/* Right Column */}
                        <aside className="flex flex-col gap-4">
                            <QuickActions />
                            <UpcomingBills />
                        </aside>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}