'use client'

import React from 'react'
import { Settings2 } from 'lucide-react'

export type PreferencesValue = {
    emailNotifications: boolean
    weeklyDigest: boolean
    interviewReminders: boolean
    theme: 'light' | 'dark' | 'system'
}

type ToggleRowProps = {
    label: string
    description: string
    checked: boolean
    onChange: (val: boolean) => void
    index: string
}

function ToggleRow({ label, description, checked, onChange, index }: ToggleRowProps) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
            <div className="flex items-start gap-2 min-w-0">
                <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="min-w-0">
                    <p className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                        {index} — {label}
                    </p>
                    <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600 mt-0.5">
                        {description}
                    </p>
                </div>
            </div>
            {/* Toggle */}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={[
                    'relative shrink-0 w-9 h-5 border transition-colors duration-200 outline-none focus-visible:ring-1 focus-visible:ring-blue-500',
                    checked
                        ? 'bg-blue-600 border-blue-500'
                        : 'bg-transparent border-neutral-300 dark:border-neutral-700',
                ].join(' ')}
            >
                <span
                    className={[
                        'absolute top-0.5 w-3.5 h-3.5 bg-white transition-all duration-200',
                        checked ? 'left-[18px]' : 'left-0.5',
                        !checked ? 'bg-neutral-400 dark:bg-neutral-600' : '',
                    ].join(' ')}
                />
            </button>
        </div>
    )
}

type Props = {
    value: PreferencesValue
    onChange: (val: PreferencesValue) => void
}

const THEME_OPTIONS: { key: PreferencesValue['theme']; label: string }[] = [
    { key: 'light',  label: 'Light'  },
    { key: 'dark',   label: 'Dark'   },
    { key: 'system', label: 'System' },
]

export function PreferencesStep({ value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-7 h-7 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
                    <Settings2 className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600" />
                </div>
                <div>
                    <p className="text-[10px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
                        Preferences
                    </p>
                    <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">
                        Customise how you interact with the platform
                    </p>
                </div>
            </div>

            {/* Notification toggles */}
            <div className="border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                        Notifications
                    </span>
                </div>
                <div className="px-4">
                    <ToggleRow
                        index="01"
                        label="Email notifications"
                        description="Receive updates about your sessions and progress"
                        checked={value.emailNotifications}
                        onChange={(v) => onChange({ ...value, emailNotifications: v })}
                    />
                    <ToggleRow
                        index="02"
                        label="Weekly digest"
                        description="A summary of your activity delivered every Monday"
                        checked={value.weeklyDigest}
                        onChange={(v) => onChange({ ...value, weeklyDigest: v })}
                    />
                    <ToggleRow
                        index="03"
                        label="Interview reminders"
                        description="Get reminded 24h before a scheduled session"
                        checked={value.interviewReminders}
                        onChange={(v) => onChange({ ...value, interviewReminders: v })}
                    />
                </div>
            </div>

            {/* Theme selector */}
            <div className="border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                        04 — Appearance
                    </span>
                </div>
                <div className="px-3 py-3 grid grid-cols-3 gap-2">
                    {THEME_OPTIONS.map((opt) => {
                        const selected = value.theme === opt.key
                        return (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => onChange({ ...value, theme: opt.key })}
                                className={[
                                    'text-left px-3 py-2.5 border transition-colors duration-150',
                                    selected
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
                                ].join(' ')}
                            >
                                <p className="text-[10px] font-mono font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                                    {opt.label}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}