import React from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'

export function PaymentStatus({
  variant,
  title,
  message,
  actionLabel,
  onAction,
}: {
  variant: 'success' | 'info' | 'error'
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}) {
  const styles =
    variant === 'success'
      ? {
          wrap: 'border-emerald-200/70 bg-emerald-50/70 text-emerald-900',
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-700" />,
        }
      : variant === 'error'
        ? {
            wrap: 'border-rose-200/70 bg-rose-50/70 text-rose-900',
            icon: <XCircle className="h-5 w-5 text-rose-700" />,
          }
        : {
            wrap: 'border-slate-200/70 bg-white/70 text-slate-950',
            icon: <Info className="h-5 w-5 text-slate-700" />,
          }

  return (
    <div className={['rounded-2xl border px-5 py-4 backdrop-blur-xl', styles.wrap].join(' ')}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{styles.icon}</div>
        <div className="min-w-0">
          <div className="text-[13.5px] font-semibold">{title}</div>
          {message ? <div className="mt-1 text-[12.5px] opacity-75">{message}</div> : null}
          {actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="mt-3 inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-[12.5px] font-semibold text-slate-900 hover:bg-white/90 transition-colors"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
