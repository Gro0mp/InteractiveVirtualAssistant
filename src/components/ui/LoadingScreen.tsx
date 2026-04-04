import React from "react";

export function LoadingScreen() {
    return (
        <div className="min-h-screen grid place-items-center text-neutral-500 font-mono text-sm">
            <div className="flex flex-col items-center gap-3">
                <span className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                Loading…
            </div>
        </div>
    )
}