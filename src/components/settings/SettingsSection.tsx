import React from 'react'

type Props = {
    tag?: string
    title: string
    description?: string
    children: React.ReactNode
    accentCorner?: 'tl' | 'tr' | 'br' | 'bl' | 'none'
    danger?: boolean
}

export function SettingsSection({
                                    tag,
                                    title,
                                    description,
                                    children,
                                    accentCorner = 'tl',
                                    danger = false,
                                }: Props) {
    return (
        <div className={[
            'bg-white dark:bg-neutral-950 border overflow-hidden transition-colors duration-300 relative',
            danger
                ? 'border-red-200 dark:border-red-900/60'
                : 'border-neutral-200 dark:border-neutral-800',
        ].join(' ')}>
            {/* Corner accent */}
            {accentCorner === 'tl' && !danger && (
                <>
                    <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
                    <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />
                </>
            )}
            {accentCorner === 'tr' && !danger && (
                <>
                    <span className="absolute top-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
                    <span className="absolute top-0 right-0 h-8 w-px bg-blue-500" aria-hidden />
                </>
            )}
            {danger && (
                <>
                    <span className="absolute top-0 left-0 w-8 h-px bg-red-500" aria-hidden />
                    <span className="absolute top-0 left-0 h-8 w-px bg-red-500" aria-hidden />
                </>
            )}

            {/* Section header */}
            <div className={[
                'px-5 py-3 border-b flex items-center justify-between gap-4',
                danger
                    ? 'border-red-100 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20'
                    : 'border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900',
            ].join(' ')}>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className={`w-2 h-2 rounded-full ${danger ? 'bg-red-300 dark:bg-red-900' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                        <span className={`w-2 h-2 rounded-full ${danger ? 'bg-red-300 dark:bg-red-900' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                        <span className={`w-2 h-2 rounded-full ${danger ? 'bg-red-300 dark:bg-red-900' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                    </div>
                    <div>
                        {tag && (
                            <p className={[
                                'text-[9px] font-mono font-semibold uppercase tracking-widest mb-0.5',
                                danger ? 'text-red-400 dark:text-red-500' : 'text-neutral-400 dark:text-neutral-600',
                            ].join(' ')}>
                                {tag}
                            </p>
                        )}
                        <p className={[
                            'text-[11px] font-mono font-semibold uppercase tracking-widest',
                            danger ? 'text-red-700 dark:text-red-400' : 'text-neutral-600 dark:text-neutral-300',
                        ].join(' ')}>
                            {title}
                        </p>
                    </div>
                </div>
                {description && (
                    <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 text-right max-w-[200px] hidden md:block">
                        {description}
                    </p>
                )}
            </div>

            <div className="px-5 py-5">
                {children}
            </div>
        </div>
    )
}