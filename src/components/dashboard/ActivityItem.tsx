import React from "react";

type ActivityItemProps = {
    title: string;
    meta: string;
    type?: "income" | "expense" | "pending";
};

export function ActivityItem({ title, meta, type = "pending" }: ActivityItemProps) {
    const getIndicatorStyle = () => {
        switch (type) {
            case "income":
                return {
                    bg: "bg-emerald-500",
                    shadow: "shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
                };
            case "expense":
                return {
                    bg: "bg-rose-500",
                    shadow: "shadow-[0_0_0_3px_rgba(244,63,94,0.15)]"
                };
            case "pending":
                return {
                    bg: "bg-amber-500",
                    shadow: "shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
                };
            default:
                return {
                    bg: "bg-blue-500",
                    shadow: "shadow-[0_0_0_3px_rgba(43,109,255,0.15)]"
                };
        }
    };

    const styles = getIndicatorStyle();

    return (
        <div className="grid grid-cols-[10px_1fr] gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 hover:border-slate-300 transition-colors">
            <div
                className={`mt-1 h-2.5 w-2.5 rounded-full ${styles.bg} ${styles.shadow}`}
            />
            <div>
                <div className="mb-0.5 text-[13px] font-bold text-slate-950">
                    {title}
                </div>
                <div className="text-xs font-semibold text-slate-900/60">{meta}</div>
            </div>
        </div>
    );
}