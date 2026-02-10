// src/components/dashboard/ActivityItem.tsx
import React from "react";

type ActivityItemProps = {
    title: string;
    meta: string;
};

export function ActivityItem({ title, meta }: ActivityItemProps) {
    return (
        <div className="grid grid-cols-[10px_1fr] gap-2.5 rounded-[14px] border border-slate-900/10 bg-white/70 p-2.5">
            <div
                className="mt-1 h-2.5 w-2.5 rounded-full shadow-[0_0_0_3px_rgba(43,109,255,0.10)]"
                style={{
                    background:
                        "radial-gradient(circle at 30% 30%, rgba(109,224,255,1), rgba(43,109,255,1))",
                }}
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
