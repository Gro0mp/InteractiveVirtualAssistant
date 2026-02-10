// src/components/dashboard/StatCard.tsx
import React from "react";

type StatCardProps = {
    label: string;
    value: string;
    delta?: string;
};

export function StatCard({ label, value, delta }: StatCardProps) {
    return (
        <div className="rounded-[18px] border border-slate-900/10 bg-white/85 p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.08)] backdrop-blur-[10px]">
            <div className="mb-2.5 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900/60">{label}</span>
                {delta ? (
                    <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-xs font-bold text-blue-700/95">
            {delta}
          </span>
                ) : null}
            </div>

            <div className="text-[22px] font-extrabold tracking-[-0.02em] text-slate-950">
                {value}
            </div>
            <div className="mt-1 text-xs text-slate-900/60">Updated just now</div>
        </div>
    );
}
