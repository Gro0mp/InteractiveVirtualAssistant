'use client'

import React from 'react'

const STEP_DESCRIPTIONS: Record<number, { title: string; body: string; tags: string[] }> = {
    1: {
        title: 'Your identity',
        body:  'We use your profile to personalise feedback and tailor interview questions to your actual background. The more context we have, the sharper the guidance.',
        tags:  ['Profile', 'Context', 'Personalisation'],
    },
    2: {
        title: 'Your direction',
        body:  'Whether you\'re prepping for a FAANG loop or pivoting into product, defining your goals lets IVA focus on what moves the needle for you.',
        tags:  ['Goals', 'Focus', 'Alignment'],
    },
    3: {
        title: 'Your environment',
        body:  'Set your preferred theme and notification cadence. We\'ll respect your inbox and only surface signals that matter.',
        tags:  ['Preferences', 'Notifications', 'Appearance'],
    },
    4: {
        title: 'Almost there',
        body:  'Review everything before we spin up your workspace. You can always revisit these settings from your account page later.',
        tags:  ['Review', 'Confirm', 'Launch'],
    },
}

type Props = {
    step: number
}

export function SetupVisual({ step }: Props) {
    const info = STEP_DESCRIPTIONS[step] ?? STEP_DESCRIPTIONS[1]

    return (
        <div className="h-full relative bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
            <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500" aria-hidden />

            {/* Grid texture */}
            <svg
                className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.03] pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
            >
                <defs>
                    <pattern id="setup-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#setup-grid)" className="text-neutral-900 dark:text-white" />
            </svg>

            {/* Ambient glow */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/8 dark:bg-blue-600/12 blur-[100px] pointer-events-none"
                aria-hidden
            />

            {/* Content */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-8 py-12 text-center gap-6">
                {/* Step counter */}
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                        Step {step} of 4
                    </span>
                </div>

                {/* Large step number */}
                <div className="relative">
                    <span className="font-mono font-bold text-[96px] leading-none select-none text-neutral-100 dark:text-neutral-900 pointer-events-none">
                        0{step}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border border-blue-500/30 flex items-center justify-center">
                            <div className="w-3 h-3 border border-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h2 className="text-[13px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest mb-2">
                        {info.title}
                    </h2>
                    <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600 leading-relaxed max-w-[240px] mx-auto">
                        {info.body}
                    </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {info.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 border border-neutral-200 dark:border-neutral-800 text-[8px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Bottom label */}
            <div className="relative px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-500" />
                <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
                    Account Setup — IVA
                </span>
            </div>
        </div>
    )
}