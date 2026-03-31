import React, { useMemo } from 'react'
import { PlanCard } from './PlanCard'

export type CheckoutPlan = 'basic' | 'pro'

export function ProductDisplay({
  onCheckout,
  onFree,
  loadingPlan,
}: {
  onCheckout: (plan: CheckoutPlan) => void
  onFree: () => void
  loadingPlan?: CheckoutPlan | null
}) {
  const plans = useMemo(
    () =>
      [
        {
          key: 'free' as const,
          title: 'Free',
          price: '$0',
          cadence: 'forever',
          description: 'Explore IVA with no commitment.',
          features: [
            { label: '5 mock interviews / month', included: true },
            { label: 'Basic job matching', included: true },
            { label: 'Resume review (1/month)', included: true },
            { label: 'Community support', included: true },
            { label: 'Priority AI responses', included: false },
            { label: 'Advanced analytics', included: false },
          ],
          ctaLabel: 'Start free',
          highlighted: false,
        },
        {
          key: 'basic' as const,
          title: 'Basic',
          price: '$19',
          cadence: '/ month',
          description: 'For candidates actively applying.',
          features: [
            { label: 'Unlimited mock interviews', included: true },
            { label: 'Smart job matching (daily)', included: true },
            { label: 'Unlimited resume tailoring', included: true },
            { label: 'Email drafting & cover letters', included: true },
            { label: 'Priority AI responses', included: true },
            { label: 'Advanced analytics', included: false },
          ],
          ctaLabel: 'Continue to Stripe',
          highlighted: true,
        },
        {
          key: 'pro' as const,
          title: 'Pro',
          price: '$29',
          cadence: '/ month',
          description: 'For power users who want every edge.',
          features: [
            { label: 'Everything in Basic', included: true },
            { label: 'Advanced progress analytics', included: true },
            { label: 'Custom coaching plans', included: true },
            { label: 'Priority support (24hr)', included: true },
            { label: 'Early feature access', included: true },
            { label: 'API access (coming soon)', included: true },
          ],
          ctaLabel: 'Continue to Stripe',
          highlighted: false,
        },
      ],
    [],
  )

  return (
    <div>
      <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
        <div className="max-w-xl">
          <h2 className="text-[16px] font-semibold text-neutral-900 dark:text-white tracking-tight" style={{ fontFamily: "'DM Mono', monospace" }}>
            Choose your plan
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-600 font-mono">
            Start free or upgrade via Stripe Checkout.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-900">
        {plans.map((p) => {
          const isPaid = p.key === 'basic' || p.key === 'pro'
          return (
            <div key={p.key} className="bg-neutral-50 dark:bg-[#0A0A0A]">
              <PlanCard
                title={p.title}
                price={p.price}
                cadence={p.cadence}
                description={p.description}
                features={p.features}
                ctaLabel={p.ctaLabel}
                highlighted={p.highlighted}
                loading={isPaid ? loadingPlan === p.key : false}
                onClick={() => {
                  if (p.key === 'free') onFree()
                  else onCheckout(p.key)
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-[11px] font-mono text-neutral-400 dark:text-neutral-700">
        Need a custom plan?{' '}
        <a
          href="#"
          className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors underline underline-offset-4"
        >
          Contact us →
        </a>
      </div>
    </div>
  )
}