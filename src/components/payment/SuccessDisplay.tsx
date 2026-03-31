import React from 'react'
import { PaymentStatus } from './PaymentStatus'

export function SuccessDisplay ({
  sessionId,
  onManageBilling,
  onGoDashboard,
}: {
  sessionId: string
  onManageBilling: (sessionId: string) => void
  onGoDashboard?: () => void
}) {
  return (
    <div className="space-y-4">
      <PaymentStatus
        variant="success"
        title="Subscription activated"
        message="You’re all set. Manage billing any time from the customer portal."
      />

      <div className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-xl p-5">
        <div className="text-[12.5px] text-slate-900/65">Session</div>
        <div className="mt-1 font-mono text-[12.5px] text-slate-950 break-all">{sessionId}</div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => onManageBilling(sessionId)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white/80 px-4 py-2.5 text-[13px] font-semibold text-slate-950 shadow-[0_8px_22px_rgba(11,18,32,0.08)] hover:bg-white/95 transition-colors"
          >
            Open billing portal
          </button>

          {onGoDashboard ? (
            <button
              type="button"
              onClick={onGoDashboard}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white/60 px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-white/85 transition-colors"
            >
              Back to dashboard
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}