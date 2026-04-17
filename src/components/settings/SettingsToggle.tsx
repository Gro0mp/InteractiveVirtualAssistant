import React from 'react'

type Props = {
    id: string
    label: string
    description?: string
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
    badge?: string
}

export function SettingsToggle({ id, label, description, checked, onChange, disabled, badge }: Props) {
    return (
        <label
            htmlFor={id}
            className={[
                'flex items-start justify-between gap-4 py-3 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 group',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                        {label}
                    </span>
                    {badge && (
                        <span className="inline-flex items-center gap-1 border border-blue-200 dark:border-blue-900 px-1.5 py-0.5">
                            <span className="w-1 h-1 rounded-full bg-blue-500" />
                            <span className="text-[8px] font-mono font-medium text-blue-600 dark:text-blue-400 uppercase tracking-widest">{badge}</span>
                        </span>
                    )}
                </div>
                {description && (
                    <p className="mt-0.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {/* Toggle */}
            <div className="shrink-0 relative mt-0.5">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <div className={[
                    'w-9 h-5 border transition-colors duration-200',
                    checked
                        ? 'bg-blue-600 border-blue-500'
                        : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700',
                ].join(' ')}>
                    <div className={[
                        'absolute top-0.5 w-4 h-4 bg-white transition-all duration-200',
                        checked ? 'left-[18px]' : 'left-0.5',
                    ].join(' ')} />
                </div>
            </div>
        </label>
    )
}