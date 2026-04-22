import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Check, Minus } from 'lucide-react'
import { Button } from '../ui/Button'
import { SettingsSection } from './SettingsSection'
import type { CheckoutPlan } from '../payment/ProductDisplay'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

type Plan = 'FREE' | 'BASIC' | 'PROFESSIONAL'
const STRIPE_SESSION_STORAGE_KEY = 'iva_stripe_session_id'

const PLAN_TO_CHECKOUT: Partial<Record<Plan, CheckoutPlan>> = {
    BASIC: 'basic',
    PROFESSIONAL: 'pro',
}

const PLANS = [
    {
        id: 'FREE' as Plan,
        name: 'Free',
        price: '$0',
        cadence: 'forever',
        features: ['5 mock interviews / month', 'Basic job matching', 'Resume review (1/month)', 'Community support'],
        missing: ['Priority AI responses', 'Advanced analytics'],
    },
    {
        id: 'BASIC' as Plan,
        name: 'Basic',
        price: '$19',
        cadence: '/ month',
        features: ['Unlimited mock interviews', 'Smart job matching (daily)', 'Unlimited resume tailoring', 'Email drafting', 'Priority AI responses'],
        missing: ['Advanced analytics'],
        highlighted: true,
    },
    {
        id: 'PROFESSIONAL' as Plan,
        name: 'Pro',
        price: '$29',
        cadence: '/ month',
        features: ['Everything in Basic', 'Advanced analytics', 'Custom coaching plans', 'Priority support (24hr)', 'Early feature access'],
        missing: [],
    },
]

type StatusMeta = { label: string; color: string; dotColor: string; banner?: string; bannerStyle?: string }

function resolveStatusMeta(status: string | null | undefined): StatusMeta {
    switch (status) {
        case 'trialing':
            return { label: 'Trialing', color: 'text-blue-600 dark:text-blue-400', dotColor: 'bg-blue-500' }
        case 'past_due':
            return {
                label: 'Past due',
                color: 'text-amber-600 dark:text-amber-400',
                dotColor: 'bg-amber-500',
                banner: 'Your last payment failed. Please update your payment method to avoid losing access.',
                bannerStyle: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400',
            }
        case 'unpaid':
            return {
                label: 'Unpaid',
                color: 'text-red-600 dark:text-red-400',
                dotColor: 'bg-red-500',
                banner: 'Your subscription is unpaid and access has been restricted. Update your payment method to restore access.',
                bannerStyle: 'border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 text-red-600 dark:text-red-400',
            }
        case 'canceled':
            return {
                label: 'Canceled',
                color: 'text-neutral-500 dark:text-neutral-400',
                dotColor: 'bg-neutral-400',
            }
        case 'active':
        default:
            return { label: 'Active', color: 'text-emerald-600 dark:text-emerald-400', dotColor: 'bg-emerald-500' }
    }
}

type Props = {
    currentPlan?: Plan
}

export function BillingTab({ currentPlan = 'FREE' }: Props) {
    const { user, refreshUser } = useAuth()
    const [plan, setPlan] = useState<Plan>(currentPlan)
    const [message, setMessage] = useState('')
    const [loadingPlan, setLoadingPlan] = useState<CheckoutPlan | null>(null)
    const [portalLoading, setPortalLoading] = useState(false)

    useEffect(() => {
        setPlan(currentPlan)
    }, [currentPlan])

    useEffect(() => {
        void refreshUser()

        const query = new URLSearchParams(window.location.search)
        const sid = query.get('session_id')
        if (sid) window.localStorage.setItem(STRIPE_SESSION_STORAGE_KEY, sid)

        if (query.get('success')) {
            setMessage('Payment successful. Your plan is syncing now...')
            return
        }
        if (query.get('canceled')) {
            setMessage('Checkout canceled — you can try again anytime.')
        }
    }, [refreshUser])

    const startCheckout = async (targetPlan: Plan) => {
        const checkoutPlan = PLAN_TO_CHECKOUT[targetPlan]
        if (!checkoutPlan) {
            setMessage('Use Manage billing to downgrade or cancel your current subscription.')
            return
        }

        setMessage('')
        setLoadingPlan(checkoutPlan)

        try {
            const stripeUrl = await api.createCheckoutSession(checkoutPlan)
            window.location.href = stripeUrl
        } catch (error: any) {
            setMessage(error.message || 'Failed to initiate checkout. Please try again.')
            setLoadingPlan(null)
        }
    }

    const openBillingPortal = async () => {
        setPortalLoading(true)
        const query = new URLSearchParams(window.location.search)
        const sessionId = query.get('session_id') ?? window.localStorage.getItem(STRIPE_SESSION_STORAGE_KEY) ?? ''

        setMessage('')

        try {
            const stripeUrl = await api.createPortalSession(sessionId)
            window.location.href = stripeUrl
        } catch (error: any) {
            setMessage(error.message || 'Failed to open billing portal. Please try again.')
            setPortalLoading(false)
        }
    }

    const subStatus  = user?.stripeSubscriptionStatus
    const statusMeta = resolveStatusMeta(subStatus)
    const currentPlanMeta = PLANS.find(p => p.id === plan)

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {statusMeta.banner && (
                <div className={`flex items-start gap-2 px-4 py-3 border ${statusMeta.bannerStyle}`}>
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-mono leading-relaxed">{statusMeta.banner}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={openBillingPortal} isLoading={portalLoading}>
                        Update payment
                    </Button>
                </div>
            )}

            <SettingsSection tag="01" title="Current Plan" accentCorner="tl">
                <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-mono font-semibold text-neutral-900 dark:text-white">
                                {currentPlanMeta?.name}
                            </span>
                            <span className="inline-flex items-center gap-1 border border-current/20 px-1.5 py-0.5">
                                <span className={`w-1 h-1 rounded-full ${statusMeta.dotColor}`} />
                                <span className={`text-[8px] font-mono font-medium uppercase tracking-widest ${statusMeta.color}`}>
                                    {statusMeta.label}
                                </span>
                            </span>
                        </div>
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
                            Next billing date: Apr 1, 2026 · {currentPlanMeta?.price}/mo
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openBillingPortal}
                            isLoading={portalLoading}
                        >
                            Manage billing
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Interviews used', used: 18, limit: plan === 'FREE' ? 5 : null },
                        { label: 'Resume reviews',  used: 4,  limit: plan === 'FREE' ? 1 : null },
                        { label: 'AI sessions',     used: 31, limit: null },
                    ].map((meter) => {
                        const pct = meter.limit ? Math.min(100, Math.round((meter.used / meter.limit) * 100)) : null
                        const overLimit = pct !== null && pct >= 100
                        return (
                            <div key={meter.label}>
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{meter.label}</span>
                                    <span className={`text-[9px] font-mono ${overLimit ? 'text-red-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                        {meter.used}{meter.limit ? ` / ${meter.limit}` : ''}
                                    </span>
                                </div>
                                {meter.limit ? (
                                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 relative">
                                        <div
                                            className={`absolute left-0 top-0 h-full transition-all ${overLimit ? 'bg-red-500' : 'bg-blue-500'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-px bg-blue-500/30 dark:bg-blue-500/20" />
                                )}
                                {!meter.limit && (
                                    <p className="mt-0.5 text-[9px] font-mono text-neutral-400 dark:text-neutral-600">Unlimited</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </SettingsSection>

            <SettingsSection tag="02" title="Change Plan" description="Upgrade or downgrade at any time" accentCorner="tr">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800">
                    {PLANS.map((p) => {
                        const isCurrent = p.id === plan
                        return (
                            <div
                                key={p.id}
                                className={[
                                    'p-5 flex flex-col gap-3 transition-colors duration-150',
                                    isCurrent
                                        ? 'bg-blue-600'
                                        : 'bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900',
                                ].join(' ')}
                            >
                                <div>
                                    <p className={`text-[9px] font-mono font-semibold uppercase tracking-widest mb-1 ${isCurrent ? 'text-blue-200' : 'text-neutral-400 dark:text-neutral-600'}`}>
                                        {p.name}
                                    </p>
                                    <div className="flex items-end gap-1">
                                        <span className={`text-2xl font-mono font-semibold ${isCurrent ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                                            {p.price}
                                        </span>
                                        <span className={`text-[10px] font-mono pb-0.5 ${isCurrent ? 'text-blue-300' : 'text-neutral-400 dark:text-neutral-600'}`}>
                                            {p.cadence}
                                        </span>
                                    </div>
                                </div>
                                <ul className="space-y-1.5 flex-1">
                                    {p.features.map(f => (
                                        <li key={f} className={`flex items-start gap-1.5 text-[10px] font-mono ${isCurrent ? 'text-blue-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                                            <Check className={`h-3 w-3 mt-0.5 shrink-0 ${isCurrent ? 'text-blue-200' : 'text-blue-500'}`} />
                                            {f}
                                        </li>
                                    ))}
                                    {p.missing.map(f => (
                                        <li key={f} className={`flex items-start gap-1.5 text-[10px] font-mono ${isCurrent ? 'text-blue-400/50' : 'text-neutral-300 dark:text-neutral-700'}`}>
                                            <Minus className="h-3 w-3 mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={isCurrent ? 'primary' : 'outline'}
                                    size="sm"
                                    className="w-full"
                                    disabled={isCurrent || Boolean(loadingPlan)}
                                    isLoading={loadingPlan === PLAN_TO_CHECKOUT[p.id]}
                                    onClick={() => {
                                        if (p.id === 'FREE') {
                                            openBillingPortal()
                                            return
                                        }
                                        startCheckout(p.id)
                                    }}
                                >
                                    {isCurrent ? 'Current plan' : p.id === 'FREE' ? 'Downgrade' : 'Upgrade'}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </SettingsSection>

            {message && (
                <div className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                    <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{message}</p>
                </div>
            )}
        </motion.div>
    )
}