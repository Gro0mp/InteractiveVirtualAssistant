import React from 'react'

type Props = {
    label: string
    description?: string
    children: React.ReactNode
    mono?: boolean
}

export function SettingsRow({ label, description, children, mono = false }: Props) {
    return (
        <div className="flex items-start justify-between gap-6 py-3.5 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0">
            <div className="flex-1 min-w-0">
                <p className="text-[12px] font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {label}
                </p>
                {description && (
                    <p className="mt-0.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            <div className="shrink-0">
                {children}
            </div>
        </div>
    )
}