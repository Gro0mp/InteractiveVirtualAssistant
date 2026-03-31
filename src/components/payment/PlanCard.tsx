import React from 'react'
import { Check, Minus } from 'lucide-react'

export type PlanCardProps = {
  title: string
  price: string
  cadence: string
  description: string
  features: { label: string; included: boolean }[]
  ctaLabel: string
  onClick: () => void
  loading?: boolean
  highlighted?: boolean
}

export function PlanCard({
  title,
  price,
  cadence,
  description,
  features,
  ctaLabel,
  onClick,
  loading,
  highlighted,
}: PlanCardProps) {
  return (
    <div
      className={[
        'relative h-full flex flex-col p-7 border transition-colors duration-150',
        highlighted
          ? 'bg-blue-600 border-blue-500'
          : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700',
      ].join(' ')}
    >
      {highlighted ? (
        <div className="absolute -top-px left-6 right-6 h-px bg-blue-400" aria-hidden />
      ) : null}

      <div className="flex items-start justify-between mb-5">
        <div>
          <h3
            className={[
              'text-xs font-semibold uppercase tracking-widest font-mono mb-1.5',
              highlighted ? 'text-blue-100' : 'text-neutral-500 dark:text-neutral-400',
            ].join(' ')}
          >
            {title}
          </h3>
          <p
            className={[
              'text-xs leading-relaxed font-mono',
              highlighted ? 'text-blue-200' : 'text-neutral-500 dark:text-neutral-600',
            ].join(' ')}
          >
            {description}
          </p>
        </div>
        {highlighted ? (
          <span className="text-[9px] font-semibold font-mono uppercase tracking-widest text-blue-200 border border-blue-400/50 px-2 py-1 whitespace-nowrap">
            Popular
          </span>
        ) : null}
      </div>

      <div className="flex items-end gap-1 mb-7">
        <span className={['text-4xl font-semibold font-mono tracking-tight', highlighted ? 'text-white' : 'text-neutral-900 dark:text-white'].join(' ')}>
          {price}
        </span>
        <span className={['pb-1 text-xs font-mono', highlighted ? 'text-blue-300' : 'text-neutral-400 dark:text-neutral-600'].join(' ')}>
          {cadence}
        </span>
      </div>

      <ul className="space-y-2.5 mb-8 flex-1" role="list">
        {features.map(({ label, included }) => (
          <li
            key={label}
            className={[
              'flex items-center gap-2.5 text-xs font-mono',
              included
                ? highlighted
                  ? 'text-blue-100'
                  : 'text-neutral-600 dark:text-neutral-400'
                : highlighted
                  ? 'text-blue-400/50'
                  : 'text-neutral-300 dark:text-neutral-800',
            ].join(' ')}
          >
            {included ? (
              <Check
                className={['w-3.5 h-3.5 flex-shrink-0', highlighted ? 'text-blue-200' : 'text-blue-500'].join(' ')}
                aria-label="Included"
              />
            ) : (
              <Minus className="w-3.5 h-3.5 flex-shrink-0 text-current" aria-label="Not included" />
            )}
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClick}
        disabled={Boolean(loading)}
        className={[
          'w-full inline-flex items-center justify-center px-4 py-3 text-xs font-semibold font-mono uppercase tracking-widest transition-colors duration-150',
          highlighted
            ? 'bg-white text-blue-700 hover:bg-blue-50'
            : 'border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:border-neutral-300 dark:hover:border-neutral-700',
          loading ? 'opacity-70 cursor-not-allowed' : '',
        ].join(' ')}
      >
        {loading ? 'Redirecting…' : ctaLabel}
      </button>

      <p className={['mt-2.5 text-center text-[10px] font-mono', highlighted ? 'text-blue-300' : 'text-neutral-400 dark:text-neutral-700'].join(' ')}>
        Cancel anytime
      </p>
    </div>
  )
}
