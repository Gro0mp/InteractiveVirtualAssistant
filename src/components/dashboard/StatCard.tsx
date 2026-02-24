import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type StatCardProps = {
    label: string;
    value: string;
    delta?: string;
    trend?: "up" | "down" | "neutral";
};

export function StatCard({ label, value, delta, trend }: StatCardProps) {
    const getTrendColor = () => {
        if (!trend) return "text-slate-600";
        switch (trend) {
            case "up": return "text-emerald-600";
            case "down": return "text-red-600";
            case "neutral": return "text-slate-600";
            default: return "text-slate-600";
        }
    };

    const getTrendBg = () => {
        if (!trend) return "bg-slate-50";
        switch (trend) {
            case "up": return "bg-emerald-50 border-emerald-200";
            case "down": return "bg-red-50 border-red-200";
            case "neutral": return "bg-slate-50 border-slate-200";
            default: return "bg-slate-50 border-slate-200";
        }
    };

    const getTrendIcon = () => {
        if (!trend) return null;
        switch (trend) {
            case "up": return <TrendingUp className="h-3 w-3" />;
            case "down": return <TrendingDown className="h-3 w-3" />;
            case "neutral": return <Minus className="h-3 w-3" />;
            default: return null;
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur transition-all hover:shadow-[0_12px_35px_rgba(11,18,32,0.08)]">
            <div className="mb-2.5 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900/60">{label}</span>
                {delta && (
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-bold flex items-center gap-1 ${getTrendBg()} ${getTrendColor()}`}>
                        {getTrendIcon()}
                        {delta}
                    </span>
                )}
            </div>

            <div className="text-[22px] font-extrabold tracking-[-0.02em] text-slate-950">
                {value}
            </div>
            <div className="mt-1 text-xs text-slate-900/60">Updated just now</div>
        </div>
    );
}