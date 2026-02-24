import React from "react";
import { Plus, FileText, Upload, Download, Calculator, MessageSquare } from "lucide-react";

export function QuickActions() {
    const actions = [
        { icon: Plus, label: "New Invoice", color: "text-violet-600", bgColor: "bg-violet-50 hover:bg-violet-100" },
        { icon: Upload, label: "Upload Receipt", color: "text-blue-600", bgColor: "bg-blue-50 hover:bg-blue-100" },
        { icon: FileText, label: "Record Expense", color: "text-rose-600", bgColor: "bg-rose-50 hover:bg-rose-100" },
        { icon: Download, label: "Export Report", color: "text-slate-600", bgColor: "bg-slate-50 hover:bg-slate-100" },
        { icon: Calculator, label: "Tax Calculator", color: "text-emerald-600", bgColor: "bg-emerald-50 hover:bg-emerald-100" },
        { icon: MessageSquare, label: "Ask AI Assistant", color: "text-indigo-600", bgColor: "bg-indigo-50 hover:bg-indigo-100" },
    ];

    return (
        <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
            <div>
                <h2 className="text-sm font-extrabold tracking-[-0.01em]">
                    Quick Actions
                </h2>
                <p className="mt-0.5 text-[12px] text-slate-500">Common tasks and shortcuts</p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={index}
                            className={`flex flex-col items-center gap-2 rounded-xl border border-slate-200 ${action.bgColor} p-3 transition-all hover:shadow-sm`}
                        >
                            <div className={`rounded-lg bg-white p-2 ${action.color}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700 text-center">
                                {action.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}