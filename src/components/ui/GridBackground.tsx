import React from "react";

export function GridBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-50 dark:bg-[#0A0A0A] transition-colors duration-300">
            {/* Fine grid lines */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <defs>
                    <pattern id="tech-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        {/* light: #e5e5e5, dark: #1a1a1a — both encoded inline via className trick using currentColor workaround */}
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-200 dark:text-[#1a1a1a]" />
                    </pattern>
                    <radialGradient id="grid-mask" cx="50%" cy="45%" rx="55%" ry="50%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                        <stop offset="75%" stopColor="currentColor" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#tech-grid)" />
            </svg>

            {/* Blue glow — subtler in light mode */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
}