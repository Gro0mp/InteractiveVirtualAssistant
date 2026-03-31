import {WifiOff} from "lucide-react";
import React from "react";

export function StatusBadge({ status }: { status: 'connected' | 'disconnected' | 'error' }) {
    if (status === 'connected') return null;
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-neutral-200/80 dark:border-neutral-700/60 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm shadow-[0_2px_8px_rgba(15,23,42,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                {status === 'disconnected' ? (
                    <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Connecting…</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-3 h-3 text-red-500" />
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Connection error — retrying</span>
                    </>
                )}
            </div>
        </div>
    );
}