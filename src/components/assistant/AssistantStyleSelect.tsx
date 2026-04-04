'use client'

import React from 'react'

export type AssistantStyle = 'friendly' | 'professional' | 'humorous' | 'ltg'

const OPTIONS: { value: AssistantStyle; label: string; description: string }[] = [
  { value: 'friendly', label: 'Friendly', description: 'Warm, concise, approachable.' },
  { value: 'professional', label: 'Professional', description: 'Direct, structured, business tone.' },
  { value: 'humorous', label: 'Humorous', description: 'Light jokes, still helpful.' },
  { value: 'ltg', label: 'Laughably Tough Geriatric', description: 'Sleek, futuristic voice.' },
]

export function AssistantStyleSelect({
  value,
  onChangeAction,
  disabled,
}: {
  value: AssistantStyle
  onChangeAction: (style: AssistantStyle) => void
  disabled?: boolean
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        Style
      </label>

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChangeAction(e.target.value as AssistantStyle)}
          className={[
            'h-8 rounded-xl px-3 pr-8 text-[11px] font-mono',
            'border border-neutral-300/70 dark:border-neutral-700/70',
            'bg-white/80 dark:bg-neutral-950/60 backdrop-blur-md',
            'text-neutral-900 dark:text-white',
            'outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40',
            disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')}
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-neutral-500 dark:text-neutral-400">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <span className="hidden sm:inline text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
        {OPTIONS.find((o) => o.value === value)?.description}
      </span>
    </div>
  )
}
