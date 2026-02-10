// src/pages/DashboardPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { MiniOrbLink } from "../components/ui/MiniOrbLink.tsx";
import { StatCard } from "../components/dashboard/StatCard.tsx";
import { ActivityItem } from "../components/dashboard/ActivityItem.tsx";

export function DashboardPage() {

    return (
        <div className="relative min-h-screen bg-white text-slate-950">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(43,109,255,0.12),transparent_60%),radial-gradient(900px_620px_at_80%_10%,rgba(109,224,255,0.14),transparent_55%)]" />
            </div>

            <MiniOrbLink />

            <div className="mx-auto max-w-[1120px] px-5 pb-14 pt-7">
                <div className="mb-[18px] flex flex-col items-start justify-between gap-4 md:flex-row">
                    <div>
                        <h1 className="m-0 text-2xl font-bold tracking-[-0.02em]">
                            Dashboard
                        </h1>
                        <div className="mt-1.5 text-[13px] leading-snug text-slate-900/60">
                            Overview of recent activity and quick actions\.
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            to="/invoices"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-900/10 bg-white/90 px-3 text-[13px] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(11,18,32,0.06)] backdrop-blur"
                        >
                            Invoices
                        </Link>
                        <button
                            type="button"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-violet-500/25 bg-[linear-gradient(180deg,rgba(43,109,255,0.14),rgba(43,109,255,0.06))] px-3 text-[13px] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(11,18,32,0.06)]"
                        >
                            New task
                        </button>
                    </div>
                </div>

                <div className="mb-3.5 grid grid-cols-1 gap-3.5 md:grid-cols-3">
                    <StatCard label="Tasks completed" value="128" delta="+12%" />
                    <StatCard label="Emails processed" value="54" delta="+4%" />
                    <StatCard label="Meetings scheduled" value="9" delta="This week" />
                </div>

                <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-[1.6fr_1fr]">
                    <section className="rounded-[18px] border border-slate-900/10 bg-white/85 p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.08)] backdrop-blur-[10px]">
                        <h2 className="mb-2.5 text-sm font-extrabold tracking-[-0.01em]">
                            Recent activity
                        </h2>

                        <div className="flex flex-col gap-2.5">
                            <ActivityItem title="Followed up with client" meta="Email · 5m ago" />
                            <ActivityItem title="Generated weekly summary" meta="Report · 1h ago" />
                            <ActivityItem title="Scheduled meeting" meta="Calendar · Yesterday" />
                        </div>
                    </section>

                    <aside className="flex flex-col gap-3.5">
                        <section className="rounded-[18px] border border-slate-900/10 bg-white/85 p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.08)] backdrop-blur-[10px]">
                            <h2 className="mb-2.5 text-sm font-extrabold tracking-[-0.01em]">
                                Quick settings
                            </h2>

                            <div className="grid grid-cols-[1fr_auto] gap-2 border-t border-slate-900/10 py-2.5 first:border-t-0 first:pt-0">
                                <div className="text-[13px] font-extrabold">Notifications</div>
                                <select className="h-[38px] w-full rounded-xl border border-slate-900/10 bg-white/80 px-3 text-[13px] outline-none">
                                    <option>Email</option>
                                    <option>Push</option>
                                    <option>None</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-[1fr_auto] gap-2 border-t border-slate-900/10 py-2.5">
                                <div className="text-[13px] font-extrabold">Theme</div>
                                <select className="h-[38px] w-full rounded-xl border border-slate-900/10 bg-white/80 px-3 text-[13px] outline-none">
                                    <option>Light</option>
                                    <option>System</option>
                                </select>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}
