import React from 'react'

export function PaymentShell({
  title = 'Billing',
  subtitle = 'Upgrade, manage your plan, and access invoices.',
  children,
}: {
  title?: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-neutral-50 dark:bg-[#0A0A0A] text-neutral-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* top border like landing sections */}
      <div className="absolute top-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-900" />

      {/* subtle gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(59,130,246,0.12),transparent_60%),radial-gradient(900px_620px_at_80%_10%,rgba(99,102,241,0.10),transparent_55%)]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 pt-24 pb-16">
        <header className="mb-10">
          <p className="text-[10px] font-medium text-blue-600 dark:text-blue-500 uppercase tracking-widest font-mono mb-3">
            Billing
          </p>
          <h1
            className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-xs md:text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-600 font-mono">
            {subtitle}
          </p>
        </header>

        <section className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors duration-300">
          <div className="p-6 sm:p-8">{children}</div>
        </section>

        <p className="mt-6 text-[11px] font-mono text-neutral-400 dark:text-neutral-700">
          Payments are processed securely by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  )
}
