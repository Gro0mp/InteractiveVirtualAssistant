import React, { useMemo } from 'react'
import { PlanCard } from './PlanCard'
import {useAuth} from "../../context/AuthContext.tsx";

export type CheckoutPlan = 'basic' | 'pro'

export function ProductDisplay({
                                 onCheckout,
                                 loadingPlan,
                               }: {
  onCheckout: (plan: CheckoutPlan) => void
  loadingPlan?: CheckoutPlan | null
}) {

  const {user} = useAuth()
  const plans = useMemo(
      () =>
          [
            {
              key: 'basic' as const,
              title: 'Basic',
              price: '$9.99',
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
              link: `https://buy.stripe.com/test_4gM14oaPxevo5Etgi814402?client_reference_id=${user?.id}`
            },
            {
              key: 'pro' as const,
              title: 'Pro',
              price: '$19.99',
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
              link: `https://buy.stripe.com/test_eVq4gA1eXbjc3wl9TK14403?client_reference_id=${user?.id}`
            },
          ],
      [user?.id],
  )

  return (
      <div>
        <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
          <div className="max-w-xl">
            <h2
                className="text-[16px] font-semibold text-neutral-900 dark:text-white tracking-tight"
                style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Choose your plan
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-600 font-mono">
              Upgrade any time. Secure checkout powered by Stripe.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-900">
          {plans.map((p) => (
              <div key={p.key} className="bg-neutral-50 dark:bg-[#0A0A0A]">
                <PlanCard
                    title={p.title}
                    price={p.price}
                    cadence={p.cadence}
                    description={p.description}
                    features={p.features}
                    ctaLabel={p.ctaLabel}
                    ctaHref={p.link}
                    highlighted={p.highlighted}
                    loading={loadingPlan === p.key}
                    onClick={() => onCheckout(p.key)}
                />
              </div>
          ))}
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